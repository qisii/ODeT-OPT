<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Office extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
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
