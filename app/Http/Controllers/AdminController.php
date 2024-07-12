<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use App\Notifications\UserRoleUpdated;
use Illuminate\Database\Eloquent\ModelNotFoundException;
//added
use Illuminate\Auth\Events\Registered;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $currentUserId = Auth::id();
        $query = User::where('id', '!=', $currentUserId);

        // Apply role filter
        if ($request->filled('role')) {
            $role = $request->input('role');
            if ($role !== '') {
                $query->whereHas('roles', function ($roleQuery) use ($role) {
                    $roleQuery->where('name', $role);
                });
            }
        }

        // Apply search query
        if ($request->has('search') && $request->input('search') !== '') {
            $search = $request->input('search');
            if ($search !== '') {
                $query->where(function ($searchQuery) use ($search) {
                $searchQuery->whereRaw('UPPER(firstname) LIKE ?', ['%' . strtoupper($search) . '%'])
                    ->orWhereRaw('UPPER(lastname) LIKE ?', ['%' . strtoupper($search) . '%'])
                    ->orWhereRaw('UPPER(email) LIKE ?', ['%' . strtoupper($search) . '%']);
                });
            } 
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(10);
        $total = $query->count(); // Get the total count of users

        if ($users) {
            // Retrieve the role names for each user
            $users->each(function ($user) {
                $user->roleNames = $user->getRoleNames();
            });
            return response()->json([
                'status' => 200,
                'users' => $users,
                'total' => $total,
            ]);
        } else {
            return response()->json([
                'status' => 'fail',
                'message' => 'Failed to fetch users',
            ], 500);
        }
    }

    public function alluser()
    {
        $users = User::all();
        return response()->json([
            'status' => 200,
            'data' => $users,
        ]);
    }

    public function indexNotification()
    {
        $user = auth()->user();

        $notifications = $user->notifications()->orderBy('created_at', 'desc')->paginate(10);
        $totalUnread = $user->unreadNotifications->count(); // Get the total count of unread notifications

        return response()->json([
            'status' => 200,
            'notifications' => $notifications,
            'total' => $notifications->total(), // Include the totalCount in the response
            'totalUnread' => $totalUnread, // Include the totalCount of unread notifications
        ]);
    }

    public function markNotification($id)
    {
        $user = auth()->user();
        
        $notification = $user->notifications()->findOrFail($id);

        if ($notification->read_at === null) {
            $notification->markAsRead();
        }

        return response()->json([
            'status' => 200,
            'message' => 'Notification marked as read successfully',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'firstname' => 'required|string',
                'lastname' => 'required|string',
                'contactnumber' => 'required|digits:9|unique:users,contactnumber',
                'email' => 'required|email|string|unique:users,email',
                'password' => [
                    'required',
                    'confirmed',
                    Password::min(8)->mixedCase()->numbers()->symbols()
                ],
            ]);
        
            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => $validator->errors(),
                ], 422);
            }

            $data = [
                'firstname' => $request->input('firstname'),
                'lastname' => $request->input('lastname'),
                'contactnumber' => $request->input('contactnumber'),
                'email' => $request->input('email'),
                'password' => bcrypt($request->input('password')),
                'role' => 'user',
                'created_by' => $request->user()->id,
            ];
    
            $user = User::create($data);
            // Dispatch the UserRegistered event
            event(new Registered($user));
    
            $role = Role::where('name', $data['role'])->first();
            $user->assignRole($role);

            return response()->json([
                'status' => 'success',
                'message' => 'User created successfully',
                'data' => new UserResource($user)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::with(['roles', 'categories'])->findOrFail($id);
        if ($user) {
            $roleNames = $user->roles->pluck('name')->first();
            $user->role = $roleNames;

            return response()->json([
                'status' => 200,
                'user' => $user,
            ]);
        }
        else
        {
            return response()->json([
                'status'=>404,
                'message' => 'User not Found',
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'image' => ['nullable', 'mimes:jpeg,png,jpg', 'max:180000'],
            'firstname' => ['required', 'string', 'max:50'],
            'middlename' => ['nullable', 'string', 'max:50'],
            'lastname' => ['required', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:50'],
            'password' => ['nullable', 'confirmed', Password::min(8)->mixedCase()->numbers()->symbols()],
            'suffix' => ['nullable', 'string', 'max:50'],
            'contactnumber' => ['required', 'digits:9', Rule::unique('users')->ignore($id)],
            'age' => ['nullable', 'digits:2'],
            'status' => ['required', 'in:Active,Disabled'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($id)],
            'role' => ['exists:roles,name'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 422);
        }

        if ($request->hasFile('image')) {
            if ($request->file('image')->isValid()) {
                // Delete the previous image if it exists
                if (File::exists(public_path('uploads/profile/' . $user->image))) {
                    File::delete(public_path('uploads/profile/' . $user->image));
                }

                $image = $request->file('image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $image->move(public_path('uploads/profile'), $imageName);
                $user->image = 'uploads/profile/' . $imageName;
            }
        }

        $user->firstname = $request->input('firstname');
        $user->middlename = $request->input('middlename');
        $user->lastname = $request->input('lastname');
        $user->address = $request->input('address');

        if ($request->filled('password')) {
            $user->password = bcrypt($request->input('password'));
        }

        $user->suffix = $request->input('suffix');
        $user->contactnumber = $request->input('contactnumber');
        $user->age = $request->input('age');
        $user->gender = $request->input('gender');
        $user->email = $request->input('email');
        $user->status = $request->input('status');

        if ($request->filled('role')) {
            $newRole = $request->input('role');
            $role = Role::where('name', $newRole)->first();
            if ($role) {
                $user->syncRoles([$role->id]);
            }
        }
        $user->updated_by = Auth::user()->id;

        if ($user->update()) {
            return response()->json([
                'status' => 200,
                'message' => 'User updated successfully',
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update user',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            // Delete the user and store Auth::user()->id in updated_by field
            $user->deleteWithHistory(Auth::user()->id);

            return response()->json(['message' => 'User deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Failed to delete user',
            ], 500);
        }
    }
}
