<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InternalOfficeProcess extends Model
{
    use HasFactory;
    protected $table = "internal_office_process_requests";
    protected $fillable = [
        'name',
        'sender_name',
        'date_received_ovcia',
        'end_date',
        'dts_num',
        'pd_num',
        'suc_num',
        'date_submitted_ched',
        'date_responded_ched',
        'date_approval_ched',
        'by_means',
        're_entry_plan_future_actions',
        'remarks',
        'office',
        'created_by',
        'updated_by',
        'category_id',
        'status',
    ];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by')->withDefault();
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by')->withDefault();
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id')->withDefault();
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
