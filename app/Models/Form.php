<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'description',
        'user_id',
        'updated_by',
    ];

    public function files()
    {
        return $this->hasMany(FormFiles::class, 'form_id'); // Define the relationship to FormFiles model
    }

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
