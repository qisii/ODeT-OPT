<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormFiles extends Model
{
    use HasFactory;
    protected $fillable = [
        'file_title',
        'file_description',
        'file',
        'form_id',
        'added_by',
        'updated_by',
    ];

    public function deleteWithHistory($updatedBy = null)
    {
        // Set the updated_by value
        $this->updated_by = $updatedBy;

        // Save the updated_by value
        $this->save();

        // Delete the user
        $this->forceDelete();
    }
}
