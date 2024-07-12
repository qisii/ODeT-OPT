<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
//added
use App\Models\User;
use Spatie\Permission\Models\Role;
use App\Notifications\NewRequestNotification;
use Illuminate\Support\Facades\Notification;

class SendNewRequestNotification
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle($event)
    {
        $roles = ['admin', 'user']; // Specify the roles you want to notify
        $users = User::role($roles)->get();
        
        Notification::send($users, new NewRequestNotification($event->log));
    }
}
