<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FormUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $form = $this->route('survey');
        
        if($this->user()->id !== $form->user_id) {
            return false;
        }
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'title' => 'required', 'string', 'max:1000',
            'description' => 'nullable', 'string', 'max:500',
            'user_id' => 'exists:users,id',
        ];
    }
}
