<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'firstname',
        'lastname',
        'middlename',
        'suffix',
        'contactnumber',
        'address',
        'age',
        'image',
        'gender',
        'created_by',
        'status', // Add 'status' to the $fillable array
        'email',
        'password',
        'updated_by',
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_user');
    }

    public function facultyAdminStaffCreated()
    {
        return $this->hasMany(FacultyAdminStaff::class, 'created_by');
    }

    public function facultyAdminStaffUpdated()
    {
        return $this->hasMany(FacultyAdminStaff::class, 'updated_by');
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


    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
