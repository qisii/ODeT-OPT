<?php

namespace App\Http\Controllers;

use App\Models\Form;
use App\Models\FormFiles;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;
use App\Http\Resources\FormResource;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\FormStoreRequest;
use App\Http\Requests\FormUpdateRequest;

class FormController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Form::query();
        
        // Apply search query
        if ($request->filled('search') && $request->input('search') !== '') {
            $search = $request->input('search');
            $query->where(function ($searchQuery) use ($search) {
                $searchQuery->whereRaw('UPPER(title) LIKE ?', ['%' . strtoupper($search) . '%'])
                    ->orWhereRaw('UPPER(description) LIKE ?', ['%' . strtoupper($search) . '%']);
            });
        }

        $forms = $query->orderBy('created_at', 'desc')->paginate(10);
        $total = $query->count(); // Get the total count of forms

        if ($forms) {
            return response()->json([
                'status' => 200,
                'forms' => $forms,
                'total' => $total,
            ]);
        } else {
            return response()->json([
                'status' => 'fail',
                'message' => 'Failed to fetch form',
            ], 500);
        }
    }

    public function indexPublic(Request $request)
    {
        $user = $request->user();
        $query = Form::query()->with('files'); // Add the 'files' relationship

        // Apply search query
        if ($request->filled('search') && $request->input('search') !== '') {
            $search = $request->input('search');
            $query->where(function ($searchQuery) use ($search) {
                $searchQuery->whereRaw('UPPER(title) LIKE ?', ['%' . strtoupper($search) . '%'])
                    ->orWhereRaw('UPPER(description) LIKE ?', ['%' . strtoupper($search) . '%']);
            });
        }

        $forms = $query->orderBy('created_at', 'desc')->paginate(10);

        if ($forms) {
            return response()->json([
                'status' => 200,
                'forms' => $forms, // Return the forms with their files
            ]);
        } else {
            return response()->json([
                'status' => 'fail',
                'message' => 'Failed to fetch forms',
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeFormModule(FormStoreRequest $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:1000'],
            'description' => ['required', 'string', 'max:100'],
        ]);
    
        $form = new Form();
        $form->title = $validated['title'];
        $form->description = $validated['description'];
        $form->created_by = $request->user()->id;
    
        if ($form->save()) {
            return response()->json([
                'status' => 'success', 
                'message' => 'Form Module created successfully', 
                'data' => new FormResource($form)
            ], 200);
        } else {
            return response()->json([
                'status' => 'error', 
                'message' => 'Failed to create form module'
            ], 500);
        }
    }

    // $file->file = 'uploads/formfiles/'.$fileName;
    // $request['file'] = $file->file;

    public function storeFormFile(Request $request)
    {
        $validated = $request->validate([
            'file_title' => ['required', 'string', 'max:50'],
            'file_description' => ['required', 'string', 'max:500'],
            'file' => ['required', 'mimes:pdf,ppt,pptx', 'max:180000'],
        ]);
        
        if ($request->hasFile("file")){
            $file = $request->file("file");
            $fileName = time().'_'.$file->getClientOriginalName();
            $file->move(\public_path("uploads/formfiles"), $fileName);

            $file = new FormFiles([
                "file" => 'uploads/formfiles/'.$fileName,
                "file_title" => $request->file_title,
                "file_description" => $request->file_description,
                "form_id" => $request->form_id,
                "added_by" => $request->user()->id,
            ]);
            // $file->save();

            if ($file->save()) {
                $files = FormFiles::where('form_id', $request->form_id)->get();

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
        $form = Form::findOrFail($id);

        if ($form) {
            return response()->json([
                'status' => 200,
                'form' => $form,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'Form not found',
            ], 404);
        }
    }

    public function showFiles($id)
    {
        $form = Form::findOrFail($id);

        if ($form) {
            $files = FormFiles::where('form_id', $id)->orderBy('created_at', 'desc')->paginate(4);

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
    public function updateFormModule(Request $request, $id)
    {
        $form = Form::findOrFail($id);

        if ($request->filled('title')) {
            $validated = $request->validate([
                'title' => ['required', 'string', 'max:1000'],
            ]);
            $form->title = $request->title;
        } else {
            $form->title = null;
        }

        if ($request->filled('description')) {
            $validated = $request->validate([
                'description' => ['required', 'string', 'max:1000'],
            ]);
            $form->description = $request->description;
        } else {
            $form->description = null;
        }
        
        $form->updated_at = Carbon::now(); // Set the updated_at field to the current date and time
        $form->updated_by = Auth::user()->id;

        if ($form->update()) {
            return response()->json([
                'status' => 200, 
                'message' => 'Form Module updated successfully', 
            ]);
        } else {
            return response()->json([
                'status' => 'error', 
                'message' => 'Failed to update form module'
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
            $form = Form::findOrFail($id);

            // Add the updated_by field
            $form->deleteWithHistory(Auth::user()->id);

            return response()->json([
                'status' => 'success',
                'message' => 'Form Module deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error', 
                'message' => 'Failed to delete form module'
            ], 500);
        }
    }

    public function deleteFile($id)
    {
        try {
            $file = FormFiles::findOrFail($id);

            // Add the updated_by field
            $file->deleteWithHistory(Auth::user()->id);

            if (File::exists(public_path("uploads/formfiles/".$file->file))) {
                File::delete(public_path("uploads/formfiles/".$file->file));
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
}
