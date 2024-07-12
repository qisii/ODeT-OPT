<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;


class Category extends Model
{
    use HasFactory;

    protected $table = "categories";
    protected $fillable = [
        'name',
        'updated_by',
    ];

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by')->withDefault();;
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'category_user');
    }
        
    public function toArray()
    {
        $array = parent::toArray();
        $array['user_id'] = $this->users->pluck('id')->toArray();
        return $array;
    }

}
