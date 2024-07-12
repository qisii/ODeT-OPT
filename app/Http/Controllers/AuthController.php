<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;
use App\Http\Resources\UserResource;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\File;
//added
use Illuminate\Auth\Events\Registered;

class AuthController extends Controller
{
    public function signup(SignupRequest $request)
    {
        $data = $request->validated();

        /** @var \App\Models\User $user */
        $user = User::create([
            'firstname' => $data['firstname'],
            'lastname' => $data['lastname'],
            'contactnumber' => $data['contactnumber'],
            'email' => $data['email'],
            'password' => bcrypt($data['password'])
        ]);

        // Dispatch the UserRegistered event
        event(new Registered($user));

        $role = Role::where('name', 'guest')->first(); // Get the guest role
        $user->assignRole($role); // Assign the guest role to the user
        
        $token = $user->createToken('main')->plainTextToken;

        return response([
            'user' => $user,
            'role' => $user->roles()->pluck('name')->first(), // Retrieve the user's role
            'token' => $token,
            'message' => "Sign up successfully"
        ], 200);
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
        $remember = $credentials['remember'] ?? false;
        unset($credentials['remember']);

        if (!Auth::attempt($credentials, $remember)) {
            return response([
                'error' => 'The provided credentials are incorrect'
            ], 422);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();
        if ($user->status === 'Disabled') {
            return response([
                'error' => 'Your account is disabled. Please contact the administrator.'
            ], 422);
        }

        $role = $user->roles()->pluck('name')->first(); // Retrieve the user's role
        $token = $user->createToken('main', ['role:'.$role])->plainTextToken;

        // Set the token expiration date
        $expirationDate = Carbon::now()->addHours(12); // Set the expiration to 12 hours
        $user->tokens()->update(['expires_at' => $expirationDate]);

        return response([
            'user' => $user,
            'role' => $role,
            'token' => $token,
            'expiration' => $expirationDate->toDateTimeString(), // Include the expiration date in the response
            'message' => "Logged in successfully"
        ], 200);        
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // $id = Auth::id(); // Retrieve the authenticated user's ID

        // $user = User::with('roles')->findOrFail($id);
        $user = User::with('roles')->findOrFail($id);

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

    public function getStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);

        return response()->json(['status' => $user->status]);
    }

    public function updateProfile(Request $request, $id)
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
            'gender' => ['nullable', 'in:Male,Female'],
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

        if ($request->filled('role')) {
            $newRole = $request->input('role');
            $role = Role::where('name', $newRole)->first();
            if ($role) {
                $user->syncRoles([$role->id]);
            }
        }

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

    public function logout(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        //Revoke the token that was used to authenticate the current request.....
        $user->currentAccessToken()->delete();
        // if ($user) {
        //     $user->tokens()->delete();
        // }

        return response([
            'success' => true
        ]);
    }
}