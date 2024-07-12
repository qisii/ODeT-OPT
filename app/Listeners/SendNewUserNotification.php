<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
//added
use App\Models\User;
use Illuminate\Support\Facades\Notification;
use App\Notifications\NewUserNotification;

class SendNewUserNotification
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
        $role = 'admin'; // Specify the role you want to notify
        $admins = User::role($role)->get();
        
        Notification::send($admins, new NewUserNotification($event->user));
    }
}
