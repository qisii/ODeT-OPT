<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\CategoryUser;
use App\Models\Office;
use App\Models\User;
use App\Models\InternalOfficeProcess;
use App\Models\ProjectOfficeManagement;
use App\Models\InternalOfficeProcessFiles;
use App\Models\ProjectOfficeManagementFiles;
use App\Models\FacultyAdminStaff;
use App\Models\FacultyAdminStaffFiles;
use App\Models\StudentInternational;
use App\Models\StudentInternationalFiles;
use App\Models\FacultyAdminStaffHistory;
use App\Models\StudentInternationalHistory;
use App\Models\InternalOfficeProcessHistory;
use App\Models\ProjectOfficeManagementHistory;
use App\Http\Resources\FacultyAdminStaffResource;
use App\Http\Resources\StudentInternationalResource;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
//added
use App\Events\NewRequestNotification;

class MobilityController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function dashboard()
    {
        try {
            $usersTotal = User::count();
            $facultyAdminStaffTotal = FacultyAdminStaff::count();
            $studentInternationalTotal = StudentInternational::count();
            $internalOfficeProcessTotal = InternalOfficeProcess::count();
            $projectOfficeManagementTotal = ProjectOfficeManagement::count();
            $total = $facultyAdminStaffTotal + $studentInternationalTotal + $internalOfficeProcessTotal + $projectOfficeManagementTotal;
    
            $facultyAdminStaffPending = FacultyAdminStaff::where('status', 'pending')->count();
            $facultyAdminStaffApproved = FacultyAdminStaff::where('status', 'approved')->count();
    
            $studentInternationalPending = StudentInternational::where('status', 'pending')->count();
            $studentInternationalApproved = StudentInternational::where('status', 'approved')->count();

            $internalOfficeProcessPending = InternalOfficeProcess::where('status', 'pending')->count();
            $internalOfficeProcessApproved = InternalOfficeProcess::where('status', 'approved')->count();

            $projectOfficeManagementPending = ProjectOfficeManagement::where('status', 'pending')->count();
            $projectOfficeManagementApproved = ProjectOfficeManagement::where('status', 'approved')->count();
    
            return response()->json([
                'status' => 'success',
                'data' => [
                    'FacultyAdminStaff' => [
                        'total' => $facultyAdminStaffTotal,
                        'pending' => $facultyAdminStaffPending,
                        'approved' => $facultyAdminStaffApproved,
                    ],
                    'StudentInternational' => [
                        'total' => $studentInternationalTotal,
                        'pending' => $studentInternationalPending,
                        'approved' => $studentInternationalApproved,
                    ],
                    'InternalOfficeProcess' => [
                        'total' => $internalOfficeProcessTotal,
                        'pending' => $internalOfficeProcessPending,
                        'approved' => $internalOfficeProcessApproved,
                    ],
                    'ProjectOfficeManagement' => [
                        'total' => $projectOfficeManagementTotal,
                        'pending' => $projectOfficeManagementPending,
                        'approved' => $projectOfficeManagementApproved,
                    ],
                    'Total' => $total,
                    'Users' => $usersTotal,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Failed to retrieve dashboard data.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function index()
    {
        $categories = Category::with('updatedBy')->orderBy('id', 'asc')->get();
        if($categories) {
            return response()->json([
                'status' => 'success',
                'data' => $categories,
            ], 200);
        }else {
            return response()->json([
                'status' => 'error', 
                'message' => 'Failed to fetch categories '
            ], 500);
        }
    }

    public function allcategories()
    {
        $categories = Category::all();
        return response()->json([
            'status' => 200,
            'categories' => $categories,
        ]);
    }

    public function allusers()
    {
        $users = User::all();
        return response()->json([
            'status' => 200,
            'users' => $users,
        ]);
    }

    public function authUpdate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category_id' => ['required', 'exists:categories,id'],
            'user_id' => ['required', 'exists:users,id'],
            'password' => ['required'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->messages(),
            ]);
        } else {
            $categoryUser = CategoryUser::where('category_id', $request->category_id)
                ->where('user_id', $request->user_id)
                ->first();

            if ($categoryUser) {
                $user = User::findOrFail($request->user_id);

                if ($user && Hash::check($request->password, $user->password)) {
                    // Authentication success
                    return response()->json([
                        'status' => 200,
                        'success' => 'Authorized to update log request',
                    ]);
                } else {
                    // Incorrect password
                    return response()->json([
                        'status' => 401,
                        'message' => 'Incorrect password',
                    ]);
                }
            }

            // User not assigned to the category or invalid credentials
            return response()->json([
                'status' => 401,
                'message' => 'You are not allowed to update',
            ]);
        }
    }

    public function indexFASM(Request $request)
    {
        $query = FacultyAdminStaff::query();

        // Apply status filter
        if ($request->filled('status')) {
            $status = $request->input('status');
            if ($status !== '') {
                $query->where('status', $status);
            }
        }
        // Apply search query
        if ($request->has('search') && $request->input('search') !== '') {
            $search = $request->input('search');
            if ($search !== '') {
                $query->where(function ($searchQuery) use ($search) {
                    $searchQuery->whereRaw('UPPER(name) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(sender_name) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(dts_num) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(pd_num) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(suc_num) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(by_means) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(office) LIKE ?', ['%' . strtoupper($search) . '%']);
                });
            }
        }
        // Apply date filter
        if ($request->filled('date')) {
            $date = $request->input('date');
            if ($date !== '') {
                $query->where(function ($dateQuery) use ($date) {
                    $dateQuery->whereDate('created_at', $date)
                        ->orWhereDate('date_received_ovcia', $date)
                        ->orWhereDate('end_date', $date);
                });
            }
        }

        $logs = $query->with(['createdBy', 'updatedBy'])->orderBy('created_at', 'desc')->paginate(10);
        $total = $query->count(); // Get the total count of logs

        if ($logs) {
            $logs->each(function ($log) {
                $log->created_by = $log->createdBy ? $log->createdBy->firstname : ''; // Assign the first name or null to a separate variable
                $log->updated_by = $log->updatedBy ? $log->updatedBy->firstname : ''; // Assign the first name or null to a separate variable
            });
            return response()->json([
                'status' => 200,
                'logs' => $logs,
                'total' => $total,
            ]);
        } else {
            return response()->json([
                'status' => 'fail',
                'message' => 'Failed to fetch requests',
            ], 500);
        }
    }

    public function indexSIS(Request $request)
    {
        $query = StudentInternational::query();

        // Apply status filter
        if ($request->filled('status')) {
            $status = $request->input('status');
            if ($status !== '') {
                $query->where('status', $status);
            }
        }
        // Apply search query
        if ($request->has('search') && $request->input('search') !== '') {
            $search = $request->input('search');
            if ($search !== '') {
                $query->where(function ($searchQuery) use ($search) {
                    $searchQuery->whereRaw('UPPER(name) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(sender_name) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(dts_num) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(pd_num) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(suc_num) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(by_means) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(office) LIKE ?', ['%' . strtoupper($search) . '%']);
                });
            }
        }

        // Apply date filter
        if ($request->filled('date')) {
            $date = $request->input('date');
            if ($date !== '') {
                $query->where(function ($dateQuery) use ($date) {
                    $dateQuery->whereDate('created_at', $date)
                        ->orWhereDate('date_received_ovcia', $date)
                        ->orWhereDate('end_date', $date);
                });
            }
        }

        $logs = $query->with(['createdBy', 'updatedBy'])->orderBy('created_at', 'desc')->paginate(10);
        $total = $query->count(); // Get the total count of logs

        if ($logs) {
            $logs->each(function ($log) {
                $log->created_by = $log->createdBy ? $log->createdBy->firstname : ''; // Assign the first name or null to a separate variable
                $log->updated_by = $log->updatedBy ? $log->updatedBy->firstname : ''; // Assign the first name or null to a separate variable
            });
            return response()->json([
                'status' => 200,
                'logs' => $logs,
                'total' => $total,
            ]);
        } else {
            return response()->json([
                'status' => 'fail',
                'message' => 'Failed to fetch requests',
            ], 500);
        }
    }

    public function indexIOP(Request $request)
    {
        $query = InternalOfficeProcess::query();

        // Apply status filter
        if ($request->filled('status')) {
            $status = $request->input('status');
            if ($status !== '') {
                $query->where('status', $status);
            }
        }
        // Apply search query
        if ($request->has('search') && $request->input('search') !== '') {
            $search = $request->input('search');
            if ($search !== '') {
                $query->where(function ($searchQuery) use ($search) {
                    $searchQuery->whereRaw('UPPER(name) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(sender_name) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(dts_num) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(pd_num) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(suc_num) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(by_means) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(office) LIKE ?', ['%' . strtoupper($search) . '%']);
                });
            }
        }

        // Apply date filter
        if ($request->filled('date')) {
            $date = $request->input('date');
            if ($date !== '') {
                $query->where(function ($dateQuery) use ($date) {
                    $dateQuery->whereDate('created_at', $date)
                        ->orWhereDate('date_received_ovcia', $date)
                        ->orWhereDate('end_date', $date);
                });
            }
        }

        $logs = $query->with(['createdBy', 'updatedBy'])->orderBy('created_at', 'desc')->paginate(10);
        $total = $query->count(); // Get the total count of logs

        if ($logs) {
            $logs->each(function ($log) {
                $log->created_by = $log->createdBy ? $log->createdBy->firstname : ''; // Assign the first name or null to a separate variable
                $log->updated_by = $log->updatedBy ? $log->updatedBy->firstname : ''; // Assign the first name or null to a separate variable
            });
            return response()->json([
                'status' => 200,
                'logs' => $logs,
                'total' => $total,
            ]);
        } else {
            return response()->json([
                'status' => 'fail',
                'message' => 'Failed to fetch requests',
            ], 500);
        }
    }

    public function indexPROM(Request $request)
    {
        $query = ProjectOfficeManagement::query();

        // Apply status filter
        if ($request->filled('status')) {
            $status = $request->input('status');
            if ($status !== '') {
                $query->where('status', $status);
            }
        }
        // Apply search query
        if ($request->has('search') && $request->input('search') !== '') {
            $search = $request->input('search');
            if ($search !== '') {
                $query->where(function ($searchQuery) use ($search) {
                    $searchQuery->whereRaw('UPPER(name) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(sender_name) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(dts_num) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(pd_num) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(suc_num) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(by_means) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(office) LIKE ?', ['%' . strtoupper($search) . '%']);
                });
            }
        }

        // Apply date filter
        if ($request->filled('date')) {
            $date = $request->input('date');
            if ($date !== '') {
                $query->where(function ($dateQuery) use ($date) {
                    $dateQuery->whereDate('created_at', $date)
                        ->orWhereDate('date_received_ovcia', $date)
                        ->orWhereDate('end_date', $date);
                });
            }
        }

        $logs = $query->with(['createdBy', 'updatedBy'])->orderBy('created_at', 'desc')->paginate(10);
        $total = $query->count(); // Get the total count of logs

        if ($logs) {
            $logs->each(function ($log) {
                $log->created_by = $log->createdBy ? $log->createdBy->firstname : ''; // Assign the first name or null to a separate variable
                $log->updated_by = $log->updatedBy ? $log->updatedBy->firstname : ''; // Assign the first name or null to a separate variable
            });
            return response()->json([
                'status' => 200,
                'logs' => $logs,
                'total' => $total,
            ]);
        } else {
            return response()->json([
                'status' => 'fail',
                'message' => 'Failed to fetch requests',
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeFASM(Request $request)
    {
        date_default_timezone_set('Asia/Manila');

        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100'],
            'sender_name' => ['required', 'string', 'max:1000'],
            'date_received_ovcia' => ['required', 'date'],
            'dts_num' => ['required', 'string', 'max:50'],
            'office' => ['required', 'exists:offices,name'],
            'by_means' => ['required', 'string', 'max:50'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 422);
        }

        $office = Office::where('name', $request->office)->first();

        if (!$office) {
            return response()->json([
                'status' => 'error',
                'message' => 'Office not found',
            ], 404);
        }

        $log = new FacultyAdminStaff([
            "name" => $request->name,
            "sender_name" => $request->sender_name,
            "date_received_ovcia" => $request->date_received_ovcia,
            "dts_num" => $request->dts_num,
            "by_means" => $request->by_means,
            "re_entry_plan_future_actions" => $request->re_entry_plan_future_actions,
            "office" => $office->name,
            "created_by" => Auth::user()->id,
            "category_id" => $request->category_id,
        ]);

        if ($log->save()) {
            event(new NewRequestNotification($log)); // Fire the event

            return response()->json([
                'status' => 'success',
                'message' => 'Request logged successfully',
            ], 200);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to log request',
            ], 500);
        }
    }

    public function storeSIS(Request $request)
    {
        date_default_timezone_set('Asia/Manila');

        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100'],
            'sender_name' => ['required', 'string', 'max:100'],
            'date_received_ovcia' => ['required', 'date'],
            'dts_num' => ['required', 'string', 'max:50'],
            'office' => ['required', 'exists:offices,name'],
            'by_means' => ['required', 'string', 'max:50'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 422);
        }

        $office = Office::where('name', $request->office)->first();

        if (!$office) {
            return response()->json([
                'status' => 'error',
                'message' => 'Office not found',
            ], 404);
        }

        $log = new StudentInternational([
            "name" => $request->name,
            "sender_name" => $request->sender_name,
            "date_received_ovcia" => $request->date_received_ovcia,
            "dts_num" => $request->dts_num,
            "by_means" => $request->by_means,
            "re_entry_plan_future_actions" => $request->re_entry_plan_future_actions,
            "office" => $office->name,
            "created_by" => Auth::user()->id,
            "category_id" => $request->category_id,
        ]);

        if ($log->save()) {
            event(new NewRequestNotification($log)); // Fire the event
            
            return response()->json([
                'status' => 'success',
                'message' => 'Request logged successfully',
            ], 200);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to log request',
            ], 500);
        }
    }

    public function storeIOP(Request $request)
    {
        date_default_timezone_set('Asia/Manila');

        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100'],
            'sender_name' => ['required', 'string', 'max:1000'],
            'date_received_ovcia' => ['required', 'date'],
            'dts_num' => ['required', 'string', 'max:50'],
            'office' => ['required', 'exists:offices,name'],
            'by_means' => ['required', 'string', 'max:50'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 422);
        }

        $office = Office::where('name', $request->office)->first();

        if (!$office) {
            return response()->json([
                'status' => 'error',
                'message' => 'Office not found',
            ], 404);
        }

        $log = new InternalOfficeProcess([
            "name" => $request->name,
            "sender_name" => $request->sender_name,
            "date_received_ovcia" => $request->date_received_ovcia,
            "dts_num" => $request->dts_num,
            "by_means" => $request->by_means,
            "re_entry_plan_future_actions" => $request->re_entry_plan_future_actions,
            "office" => $office->name,
            "created_by" => Auth::user()->id,
            "category_id" => $request->category_id,
        ]);

        if ($log->save()) {
            event(new NewRequestNotification($log)); // Fire the event

            return response()->json([
                'status' => 'success',
                'message' => 'Request logged successfully',
            ], 200);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to log request',
            ], 500);
        }
    }

    public function storePROM(Request $request)
    {
        date_default_timezone_set('Asia/Manila');

        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100'],
            'sender_name' => ['required', 'string', 'max:1000'],
            'date_received_ovcia' => ['required', 'date'],
            'dts_num' => ['required', 'string', 'max:50'],
            'office' => ['required', 'exists:offices,name'],
            'by_means' => ['required', 'string', 'max:50'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 422);
        }

        $office = Office::where('name', $request->office)->first();

        if (!$office) {
            return response()->json([
                'status' => 'error',
                'message' => 'Office not found',
            ], 404);
        }

        $log = new ProjectOfficeManagement([
            "name" => $request->name,
            "sender_name" => $request->sender_name,
            "date_received_ovcia" => $request->date_received_ovcia,
            "dts_num" => $request->dts_num,
            "by_means" => $request->by_means,
            "re_entry_plan_future_actions" => $request->re_entry_plan_future_actions,
            "office" => $office->name,
            "created_by" => Auth::user()->id,
            "category_id" => $request->category_id,
        ]);

        if ($log->save()) {
            event(new NewRequestNotification($log)); // Fire the event

            return response()->json([
                'status' => 'success',
                'message' => 'Request logged successfully',
            ], 200);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to log request',
            ], 500);
        }
    }

    public function storeFormFileFASM(Request $request)
    {
        $validated = $request->validate([
            'file_title' => ['required', 'string', 'max:50'],
            'file_description' => ['required', 'string', 'max:500'],
            'file' => ['required', 'mimes:pdf,ppt,pptx', 'max:180000'],
        ]);
        
        if ($request->hasFile("file")){
            $file = $request->file("file");
            $fileName = time().'_'.$file->getClientOriginalName();
            $file->move(\public_path("uploads/facultyadminstaff"), $fileName);

            $file = new FacultyAdminStaffFiles([
                "file" => 'uploads/facultyadminstaff/'.$fileName,
                "file_title" => $request->file_title,
                "file_description" => $request->file_description,
                "document_id" => $request->document_id,
                "added_by" => Auth::user()->id,
            ]);
            // $file->save();

            if ($file->save()) {
                $files = FacultyAdminStaffFiles::where('document_id', $request->document_id)->get();

                return response()->json([
                    'status' => 'success',
                    'message' => 'File added successfully',
                    'data' => $files
                ], 200);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Failed to add file'
                ], 500);
            }
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'No file provided'
            ], 400);
        }
    }

    public function storeFormFileSIS(Request $request)
    {
        $validated = $request->validate([
            'file_title' => ['required', 'string', 'max:50'],
            'file_description' => ['required', 'string', 'max:500'],
            'file' => ['required', 'mimes:pdf,ppt,pptx', 'max:180000'],
        ]);
        
        if ($request->hasFile("file")){
            $file = $request->file("file");
            $fileName = time().'_'.$file->getClientOriginalName();
            $file->move(\public_path("uploads/studentinternational"), $fileName);

            $file = new StudentInternationalFiles([
                "file" => 'uploads/studentinternational/'.$fileName,
                "file_title" => $request->file_title,
                "file_description" => $request->file_description,
                "document_id" => $request->document_id,
                "added_by" => Auth::user()->id,
            ]);
            // $file->save();

            if ($file->save()) {
                $files = StudentInternationalFiles::where('document_id', $request->document_id)->get();

                return response()->json([
                    'status' => 'success',
                    'message' => 'File added successfully',
                    'data' => $files
                ], 200);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Failed to add file'
                ], 500);
            }
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'No file provided'
            ], 400);
        }
    }

    public function storeFormFileIOP(Request $request)
    {
        $validated = $request->validate([
            'file_title' => ['required', 'string', 'max:50'],
            'file_description' => ['required', 'string', 'max:500'],
            'file' => ['required', 'mimes:pdf,ppt,pptx', 'max:180000'],
        ]);
        
        if ($request->hasFile("file")){
            $file = $request->file("file");
            $fileName = time().'_'.$file->getClientOriginalName();
            $file->move(\public_path("uploads/internalofficeprocess"), $fileName);

            $file = new InternalOfficeProcessFiles([
                "file" => 'uploads/internalofficeprocess/'.$fileName,
                "file_title" => $request->file_title,
                "file_description" => $request->file_description,
                "document_id" => $request->document_id,
                "added_by" => Auth::user()->id,
            ]);
            // $file->save();

            if ($file->save()) {
                $files = InternalOfficeProcessFiles::where('document_id', $request->document_id)->get();

                return response()->json([
                    'status' => 'success',
                    'message' => 'File added successfully',
                    'data' => $files
                ], 200);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Failed to add file'
                ], 500);
            }
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'No file provided'
            ], 400);
        }
    }

    public function storeFormFilePROM(Request $request)
    {
        $validated = $request->validate([
            'file_title' => ['required', 'string', 'max:50'],
            'file_description' => ['required', 'string', 'max:500'],
            'file' => ['required', 'mimes:pdf,ppt,pptx', 'max:180000'],
        ]);
        
        if ($request->hasFile("file")){
            $file = $request->file("file");
            $fileName = time().'_'.$file->getClientOriginalName();
            $file->move(\public_path("uploads/projectofficemanagement"), $fileName);

            $file = new ProjectOfficeManagementFiles([
                "file" => 'uploads/projectofficemanagement/'.$fileName,
                "file_title" => $request->file_title,
                "file_description" => $request->file_description,
                "document_id" => $request->document_id,
                "added_by" => Auth::user()->id,
            ]);
            // $file->save();

            if ($file->save()) {
                $files = ProjectOfficeManagementFiles::where('document_id', $request->document_id)->get();

                return response()->json([
                    'status' => 'success',
                    'message' => 'File added successfully',
                    'data' => $files
                ], 200);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Failed to add file'
                ], 500);
            }
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'No file provided'
            ], 400);
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
        $category = Category::with('users')->findOrFail($id);

        if ($category) {
            return response()->json([
                'status' => 200,
                'category' => $category,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Category not found',
            ], 404);
        }
    }

    public function showFASM($id)
    {
        $log = FacultyAdminStaff::with(['createdBy', 'updatedBy', 'category'])->findOrFail($id);

        if ($log) {
            return response()->json([
                'status' => 200,
                'log' => $log,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Log/Request not found',
            ], 404);
        }
    }

    public function showFASMHistory($id, Request $request)
    {
        $log = FacultyAdminStaff::with(['createdBy', 'updatedBy', 'category'])->findOrFail($id);

        if ($log) {
            $query = FacultyAdminStaffHistory::where('request_id', $log->id)
                ->with(['createdBy', 'updatedBy', 'category'])
                ->orderBy('created_at', 'desc');

            // Apply search query
            if ($request->has('search') && $request->input('search') !== '') {
                $search = $request->input('search');
                if ($search !== '') {
                    $query->where(function ($searchQuery) use ($search) {
                        $searchQuery->whereRaw('UPPER(name) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(sender_name) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(date_received_ovcia::text) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(start_date::text) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(end_date::text) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(date_submitted_ched::text) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(date_responded_ched::text) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(date_approval_ched::text) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(dts_num) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(pd_num) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(suc_num) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(re_entry_plan_future_actions) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(remarks) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(office) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(by_means) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(office) LIKE ?', ['%' . strtoupper($search) . '%']);
                    });
                }
            }

            $history = $query->paginate(5);

            return response()->json([
                'status' => 200,
                'history' => $history,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'History not found',
            ], 404);
        }
    }

    public function showSIS($id)
    {
        $log = StudentInternational::with(['createdBy', 'updatedBy', 'category'])->findOrFail($id);

        if ($log) {
            return response()->json([
                'status' => 200,
                'log' => $log,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Log/Request not found',
            ], 404);
        }
    }

    public function showSISHistory($id, Request $request)
    {
        $log = StudentInternational::with(['createdBy', 'updatedBy', 'category'])->findOrFail($id);

        if ($log) {
            $query = StudentInternationalHistory::where('request_id', $log->id)
                ->with(['createdBy', 'updatedBy', 'category'])
                ->orderBy('created_at', 'desc');

            // Apply search query
            if ($request->has('search') && $request->input('search') !== '') {
                $search = $request->input('search');
                if ($search !== '') {
                    $query->where(function ($searchQuery) use ($search) {
                        $searchQuery->whereRaw('UPPER(name) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(sender_name) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(date_received_ovcia::text) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(start_date::text) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(end_date::text) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(date_submitted_ched::text) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(date_responded_ched::text) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(date_approval_ched::text) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(dts_num) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(pd_num) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(suc_num) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(re_entry_plan_future_actions) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(remarks) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(office) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(by_means) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(office) LIKE ?', ['%' . strtoupper($search) . '%']);
                    });
                }
            }

            $history = $query->paginate(5);

            return response()->json([
                'status' => 200,
                'history' => $history,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'History not found',
            ], 404);
        }
    }

    public function showIOP($id)
    {
        $log = InternalOfficeProcess::with(['createdBy', 'updatedBy', 'category'])->findOrFail($id);

        if ($log) {
            return response()->json([
                'status' => 200,
                'log' => $log,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Log/Request not found',
            ], 404);
        }
    }

    public function showIOPHistory($id, Request $request)
    {
        $log = InternalOfficeProcess::with(['createdBy', 'updatedBy', 'category'])->findOrFail($id);

        if ($log) {
            $query = InternalOfficeProcessHistory::where('request_id', $log->id)
                ->with(['createdBy', 'updatedBy', 'category'])
                ->orderBy('created_at', 'desc');

            // Apply search query
            if ($request->has('search') && $request->input('search') !== '') {
                $search = $request->input('search');
                if ($search !== '') {
                    $query->where(function ($searchQuery) use ($search) {
                        $searchQuery->whereRaw('UPPER(name) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(sender_name) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(date_received_ovcia::text) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(start_date::text) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(end_date::text) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(date_submitted_ched::text) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(date_responded_ched::text) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(date_approval_ched::text) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(dts_num) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(pd_num) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(suc_num) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(re_entry_plan_future_actions) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(remarks) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(office) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(by_means) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(office) LIKE ?', ['%' . strtoupper($search) . '%']);
                    });
                }
            }

            $history = $query->paginate(5);

            return response()->json([
                'status' => 200,
                'history' => $history,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'History not found',
            ], 404);
        }
    }

    public function showPROM($id)
    {
        $log = ProjectOfficeManagement::with(['createdBy', 'updatedBy', 'category'])->findOrFail($id);

        if ($log) {
            return response()->json([
                'status' => 200,
                'log' => $log,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Log/Request not found',
            ], 404);
        }
    }

    public function showPROMHistory($id, Request $request)
    {
        $log = ProjectOfficeManagement::with(['createdBy', 'updatedBy', 'category'])->findOrFail($id);

        if ($log) {
            $query = ProjectOfficeManagementHistory::where('request_id', $log->id)
                ->with(['createdBy', 'updatedBy', 'category'])
                ->orderBy('created_at', 'desc');

            // Apply search query
            if ($request->has('search') && $request->input('search') !== '') {
                $search = $request->input('search');
                if ($search !== '') {
                    $query->where(function ($searchQuery) use ($search) {
                        $searchQuery->whereRaw('UPPER(name) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(sender_name) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(date_received_ovcia::text) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(start_date::text) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(end_date::text) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(date_submitted_ched::text) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(date_responded_ched::text) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(date_approval_ched::text) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(dts_num) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(pd_num) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(suc_num) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(re_entry_plan_future_actions) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(remarks) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(office) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(by_means) LIKE ?', ['%' . strtoupper($search) . '%'])
                        ->orWhereRaw('UPPER(office) LIKE ?', ['%' . strtoupper($search) . '%']);
                    });
                }
            }

            $history = $query->paginate(5);

            return response()->json([
                'status' => 200,
                'history' => $history,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'History not found',
            ], 404);
        }
    }

    public function showFilesFASM($id)
    {
        $log = FacultyAdminStaff::with(['createdBy', 'updatedBy', 'category'])->findOrFail($id);

        if ($log) {
            $files = FacultyAdminStaffFiles::with('addedBy')->where('document_id', $id)->orderBy('created_at', 'desc')->paginate(3);

            return response()->json([
                'status' => 200,
                'files' => $files,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Form not found',
            ], 404);
        }
    }

    public function showFilesSIS($id)
    {
        $log = StudentInternational::findOrFail($id);

        if ($log) {
            $files = StudentInternationalFiles::with('addedBy')->where('document_id', $id)->orderBy('created_at', 'desc')->paginate(3);

            return response()->json([
                'status' => 200,
                'files' => $files,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Form not found',
            ], 404);
        }
    }
    
    public function showFilesIOP($id)
    {
        $log = InternalOfficeProcess::with(['createdBy', 'updatedBy', 'category'])->findOrFail($id);

        if ($log) {
            $files = InternalOfficeProcessFiles::with('addedBy')->where('document_id', $id)->orderBy('created_at', 'desc')->paginate(3);

            return response()->json([
                'status' => 200,
                'files' => $files,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Form not found',
            ], 404);
        }
    }

    public function showFilesPROM($id)
    {
        $log = ProjectOfficeManagement::with(['createdBy', 'updatedBy', 'category'])->findOrFail($id);

        if ($log) {
            $files = ProjectOfficeManagementFiles::with('addedBy')->where('document_id', $id)->orderBy('created_at', 'desc')->paginate(3);

            return response()->json([
                'status' => 200,
                'files' => $files,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Form not found',
            ], 404);
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
        $category = Category::findOrFail($id);
        $category->updated_at = Carbon::now();
        $category->updated_by = $request->user()->id;
        $category->save();

        $category->users()->attach($request->user_id, ['updated_by' => $request->user()->id]);

        return response()->json([
            'status' => 200,
            'message' => 'Category updated successfully',
            'category' => $category, // Include the updated category in the response
        ]);
    }
    
     public function updateFASM(Request $request, $id)
    {
        $log = FacultyAdminStaff::with(['createdBy', 'updatedBy', 'category'])->findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100'],
            'sender_name' => ['required', 'string', 'max:100'],
            'dts_num' => ['required', 'string', 'max:100'],
            'pd_num' => ['nullable', 'string', 'max:100'],
            'suc_num' => ['nullable', 'string', 'max:100'],
            'by_means' => ['required', 'string', 'max:100'],
            'remarks' => ['nullable', 'string', 'max:50'],
            're_entry_plan_future_actions' => ['nullable', 'string', 'max:500'],
            'status' => ['nullable', 'in:pending,approved'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
            'date_submitted_ched' => ['nullable', 'date'],
            'date_responded_ched' => ['nullable', 'date'],
            'date_approval_ched' => ['nullable', 'date'],
            'office' => ['nullable', 'exists:offices,name']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 422);
        }

        $log->name = $request->name;
        $log->sender_name = $request->sender_name;
        $log->dts_num = $request->dts_num;
        $log->pd_num = $request->filled('pd_num') ? $request->pd_num : null;
        $log->suc_num = $request->filled('suc_num') ? $request->suc_num : null;
        $log->by_means = $request->by_means;
        $log->remarks = $request->filled('remarks') ? $request->remarks : null;
        $log->re_entry_plan_future_actions = $request->filled('re_entry_plan_future_actions') ? $request->re_entry_plan_future_actions : null;
        $log->status = $request->filled('status') ? $request->status : null;
        $log->start_date = $request->filled('start_date') ? $request->start_date : null;
        $log->end_date = $request->filled('end_date') ? $request->end_date : null;
        $log->date_submitted_ched = $request->filled('date_submitted_ched') ? $request->date_submitted_ched : null;
        $log->date_responded_ched = $request->filled('date_responded_ched') ? $request->date_responded_ched : null;
        $log->date_approval_ched = $request->filled('date_approval_ched') ? $request->date_approval_ched : null;
        
        if ($request->filled('office')) {
            $newOffice = $request->input('office');
            $office = Office::where('name', $newOffice)->first();
            if ($office) {
                $log->office = $request->office;
            }
        }

        $log->updated_by = Auth::user()->id;
        $log->updated_at = Carbon::now();

        if ($log->save()) {
            return response()->json([
                'status' => 200, 
                'message' => 'Log Request updated successfully'
            ]);
        } else {
            return response()->json([
                'status' => 'error', 
                'message' => 'Failed to update log request'
            ], 500);
        }
    }

    public function updateSIS(Request $request, $id)
    {
        $log = StudentInternational::with(['createdBy', 'updatedBy', 'category'])->findOrFail($id);
        
        $validator = Validator::make($request->all(),[
            'name' => ['required', 'string', 'max:100'],
            'sender_name' => ['required', 'string', 'max:100'],
            'dts_num' => ['required', 'string', 'max:100'],
            'pd_num' => ['nullable', 'string', 'max:100'],
            'suc_num' => ['nullable', 'string', 'max:100'],
            'by_means' => ['required', 'string', 'max:100'],
            'remarks' => ['nullable', 'string', 'max:50'],
            're_entry_plan_future_actions' => ['nullable', 'string', 'max:500'],
            'status' => ['nullable', 'in:pending,approved'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
            'date_submitted_ched' => ['nullable', 'date'],
            'date_responded_ched' => ['nullable', 'date'],
            'date_approval_ched' => ['nullable', 'date'],
            'office' => ['nullable', 'exists:offices,name']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 422);
        }

        $log->name = $request->name;
        $log->sender_name = $request->sender_name;
        $log->dts_num = $request->dts_num;
        $log->pd_num = $request->filled('pd_num') ? $request->pd_num : null;
        $log->suc_num = $request->filled('suc_num') ? $request->suc_num : null;
        $log->by_means = $request->by_means;
        $log->remarks = $request->filled('remarks') ? $request->remarks : null;
        $log->re_entry_plan_future_actions = $request->filled('re_entry_plan_future_actions') ? $request->re_entry_plan_future_actions : null;
        $log->status = $request->filled('status') ? $request->status : null;
        $log->start_date = $request->filled('start_date') ? $request->start_date : null;
        $log->end_date = $request->filled('end_date') ? $request->end_date : null;
        $log->date_submitted_ched = $request->filled('date_submitted_ched') ? $request->date_submitted_ched : null;
        $log->date_responded_ched = $request->filled('date_responded_ched') ? $request->date_responded_ched : null;
        $log->date_approval_ched = $request->filled('date_approval_ched') ? $request->date_approval_ched : null;
        
        if ($request->filled('office')) {
            $newOffice = $request->input('office');
            $office = Office::where('name', $newOffice)->first();
            if ($office) {
                $log->office = $request->office;
            }
        }

        $log->updated_by = Auth::user()->id;
        $log->updated_at = Carbon::now();

        if ($log->save()) {
            return response()->json([
                'status' => 200, 
                'message' => 'Log Request updated successfully'
            ]);
        } else {
            return response()->json([
                'status' => 'error', 
                'message' => 'Failed to update log request'
            ], 500);
        }
    }

    public function updateIOP(Request $request, $id)
    {
        $log = InternalOfficeProcess::with(['createdBy', 'updatedBy', 'category'])->findOrFail($id);
        
        $validator = Validator::make($request->all(),[
            'name' => ['required', 'string', 'max:100'],
            'sender_name' => ['required', 'string', 'max:100'],
            'dts_num' => ['required', 'string', 'max:100'],
            'pd_num' => ['nullable', 'string', 'max:100'],
            'suc_num' => ['nullable', 'string', 'max:100'],
            'by_means' => ['required', 'string', 'max:100'],
            'remarks' => ['nullable', 'string', 'max:50'],
            're_entry_plan_future_actions' => ['nullable', 'string', 'max:500'],
            'status' => ['nullable', 'in:pending,approved'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
            'date_submitted_ched' => ['nullable', 'date'],
            'date_responded_ched' => ['nullable', 'date'],
            'date_approval_ched' => ['nullable', 'date'],
            'office' => ['nullable', 'exists:offices,name']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 422);
        }

        $log->name = $request->name;
        $log->sender_name = $request->sender_name;
        $log->dts_num = $request->dts_num;
        $log->pd_num = $request->filled('pd_num') ? $request->pd_num : null;
        $log->suc_num = $request->filled('suc_num') ? $request->suc_num : null;
        $log->by_means = $request->by_means;
        $log->remarks = $request->filled('remarks') ? $request->remarks : null;
        $log->re_entry_plan_future_actions = $request->filled('re_entry_plan_future_actions') ? $request->re_entry_plan_future_actions : null;
        $log->status = $request->filled('status') ? $request->status : null;
        $log->start_date = $request->filled('start_date') ? $request->start_date : null;
        $log->end_date = $request->filled('end_date') ? $request->end_date : null;
        $log->date_submitted_ched = $request->filled('date_submitted_ched') ? $request->date_submitted_ched : null;
        $log->date_responded_ched = $request->filled('date_responded_ched') ? $request->date_responded_ched : null;
        $log->date_approval_ched = $request->filled('date_approval_ched') ? $request->date_approval_ched : null;
        
        if ($request->filled('office')) {
            $newOffice = $request->input('office');
            $office = Office::where('name', $newOffice)->first();
            if ($office) {
                $log->office = $request->office;
            }
        }

        $log->updated_by = Auth::user()->id;
        $log->updated_at = Carbon::now();

        if ($log->save()) {
            return response()->json([
                'status' => 200, 
                'message' => 'Log Request updated successfully'
            ]);
        } else {
            return response()->json([
                'status' => 'error', 
                'message' => 'Failed to update log request'
            ], 500);
        }
    }

    public function updatePROM(Request $request, $id)
    {
        $log = ProjectOfficeManagement::with(['createdBy', 'updatedBy', 'category'])->findOrFail($id);
        
        $validator = Validator::make($request->all(),[
            'name' => ['required', 'string', 'max:100'],
            'sender_name' => ['required', 'string', 'max:100'],
            'dts_num' => ['required', 'string', 'max:100'],
            'pd_num' => ['nullable', 'string', 'max:100'],
            'suc_num' => ['nullable', 'string', 'max:100'],
            'by_means' => ['required', 'string', 'max:100'],
            'remarks' => ['nullable', 'string', 'max:50'],
            're_entry_plan_future_actions' => ['nullable', 'string', 'max:500'],
            'status' => ['nullable', 'in:pending,approved'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
            'date_submitted_ched' => ['nullable', 'date'],
            'date_responded_ched' => ['nullable', 'date'],
            'date_approval_ched' => ['nullable', 'date'],
            'office' => ['nullable', 'exists:offices,name']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 422);
        }

        $log->name = $request->name;
        $log->sender_name = $request->sender_name;
        $log->dts_num = $request->dts_num;
        $log->pd_num = $request->filled('pd_num') ? $request->pd_num : null;
        $log->suc_num = $request->filled('suc_num') ? $request->suc_num : null;
        $log->by_means = $request->by_means;
        $log->remarks = $request->filled('remarks') ? $request->remarks : null;
        $log->re_entry_plan_future_actions = $request->filled('re_entry_plan_future_actions') ? $request->re_entry_plan_future_actions : null;
        $log->status = $request->filled('status') ? $request->status : null;
        $log->start_date = $request->filled('start_date') ? $request->start_date : null;
        $log->end_date = $request->filled('end_date') ? $request->end_date : null;
        $log->date_submitted_ched = $request->filled('date_submitted_ched') ? $request->date_submitted_ched : null;
        $log->date_responded_ched = $request->filled('date_responded_ched') ? $request->date_responded_ched : null;
        $log->date_approval_ched = $request->filled('date_approval_ched') ? $request->date_approval_ched : null;
        
        if ($request->filled('office')) {
            $newOffice = $request->input('office');
            $office = Office::where('name', $newOffice)->first();
            if ($office) {
                $log->office = $request->office;
            }
        }

        $log->updated_by = Auth::user()->id;
        $log->updated_at = Carbon::now();

        if ($log->save()) {
            return response()->json([
                'status' => 200, 
                'message' => 'Log Request updated successfully'
            ]);
        } else {
            return response()->json([
                'status' => 'error', 
                'message' => 'Failed to update log request'
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
        //
    }

    public function destroyFASM($id)
    {
        try {
            $log = FacultyAdminStaff::findOrFail($id);
    
            // Add the updated_by field
            $log->deleteWithHistory(Auth::user()->id);
    
            if ($log->delete()) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Log Request deleted successfully'
                ], 200);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Failed to delete log request'
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete log request'
            ], 500);
        }
    }

    public function deleteFileFASM($id)
    {
        try {
            $file = FacultyAdminStaffFiles::findOrFail($id);
    
            // Add the updated_by field
            $file->deleteWithHistory(Auth::user()->id);
    
            if (File::exists(public_path("uploads/facultyadminstaff/" . $file->file))) {
                File::delete(public_path("uploads/facultyadminstaff/" . $file->file));
            }
    
            return response()->json([
                'status' => 'success',
                'message' => 'File deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete file'
            ], 500);
        }
    }

    public function destroySIS($id)
    {
        try {
            $log = StudentInternational::findOrFail($id);

            // Add the updated_by field
            $log->deleteWithHistory(Auth::user()->id);

            if ($log->delete()) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Log Request deleted successfully'
                ], 200);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Failed to delete log request'
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete log request'
            ], 500);
        }
    }

    public function deleteFileSIS($id)
    {
        try {
            $file = StudentInternationalFiles::findOrFail($id);
    
            // Add the updated_by field
            $file->deleteWithHistory(Auth::user()->id);
    
            if (File::exists(public_path("uploads/studentinternational/" . $file->file))) {
                File::delete(public_path("uploads/studentinternational/" . $file->file));
            }
    
            return response()->json([
                'status' => 'success',
                'message' => 'File deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete file'
            ], 500);
        }
    }

    public function destroyIOP($id)
    {
        try {
            $log = InternalOfficeProcess::findOrFail($id);

            // Add the updated_by field
            $log->deleteWithHistory(Auth::user()->id);

            if ($log->delete()) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Log Request deleted successfully'
                ], 200);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Failed to delete log request'
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete log request'
            ], 500);
        }
    }

    public function deleteFileIOP($id)
    {
        try {
            $file = InternalOfficeProcessFiles::findOrFail($id);
    
            // Add the updated_by field
            $file->deleteWithHistory(Auth::user()->id);
    
            if (File::exists(public_path("uploads/internalofficeprocess/" . $file->file))) {
                File::delete(public_path("uploads/internalofficeprocess/" . $file->file));
            }
    
            return response()->json([
                'status' => 'success',
                'message' => 'File deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete file'
            ], 500);
        }
    }

    public function destroyPROM($id)
    {
        try {
            $log = ProjectOfficeManagement::findOrFail($id);

            // Add the updated_by field
            $log->deleteWithHistory(Auth::user()->id);

            if ($log->delete()) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Log Request deleted successfully'
                ], 200);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Failed to delete log request'
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete log request'
            ], 500);
        }
    }

    public function deleteFilePROM($id)
    {
        try {
            $file = ProjectOfficeManagementFiles::findOrFail($id);
    
            // Add the updated_by field
            $file->deleteWithHistory(Auth::user()->id);
    
            if (File::exists(public_path("uploads/projectofficemanagement/" . $file->file))) {
                File::delete(public_path("uploads/projectofficemanagement/" . $file->file));
            }
    
            return response()->json([
                'status' => 'success',
                'message' => 'File deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete file'
            ], 500);
        }
    }

    public function removeUser($categoryId, $userId)
    {
        $category = Category::findOrFail($categoryId);
        $category->users()->detach($userId);

        return response()->json([
            'status' => 200,
            'message' => 'User removed from the category successfully',
        ]);
    }

}
