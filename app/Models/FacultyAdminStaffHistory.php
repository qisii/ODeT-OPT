<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FacultyAdminStaffHistory extends Model
{
    use HasFactory;
    protected $table = "faculty_admin_staff_requests_history";

    protected $fillable = [
        'request_id',
        'name',
        'sender_name',
        'date_received_ovcia',
        'start_date',
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
        'operation',
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
}
