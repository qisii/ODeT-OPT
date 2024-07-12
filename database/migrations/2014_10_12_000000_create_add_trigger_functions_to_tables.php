<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // trigger function for faculty_admin_staff_requests
        DB::unprepared('
            CREATE OR REPLACE FUNCTION faculty_admin_staff_requests_trigger_function()
            RETURNS TRIGGER AS $$
            BEGIN
            IF TG_OP = \'INSERT\' THEN
                INSERT INTO faculty_admin_staff_requests_history (request_id, name, created_by, sender_name, date_received_ovcia, start_date, end_date, dts_num, pd_num, suc_num, date_submitted_ched, date_responded_ched, date_approval_ched, by_means, re_entry_plan_future_actions, remarks, office, updated_by, category_id, status, operation, created_at, updated_at)
                VALUES (NEW.id, NEW.name, NEW.created_by, NEW.sender_name, NEW.date_received_ovcia, NEW.start_date, NEW.end_date, NEW.dts_num, NEW.pd_num, NEW.suc_num, NEW.date_submitted_ched, NEW.date_responded_ched, NEW.date_approval_ched, NEW.by_means, NEW.re_entry_plan_future_actions, NEW.remarks, NEW.office, NEW.updated_by, NEW.category_id, NEW.status, \'INSERT\', current_timestamp, current_timestamp);
            ELSIF TG_OP = \'UPDATE\' THEN
                INSERT INTO faculty_admin_staff_requests_history (request_id, name, created_by, sender_name, date_received_ovcia, start_date, end_date, dts_num, pd_num, suc_num, date_submitted_ched, date_responded_ched, date_approval_ched, by_means, re_entry_plan_future_actions, remarks, office, updated_by, category_id, status, operation, created_at, updated_at)
                VALUES (NEW.id, NEW.name, NEW.created_by, NEW.sender_name, NEW.date_received_ovcia, NEW.start_date, NEW.end_date, NEW.dts_num, NEW.pd_num, NEW.suc_num, NEW.date_submitted_ched, NEW.date_responded_ched, NEW.date_approval_ched, NEW.by_means, NEW.re_entry_plan_future_actions, NEW.remarks, NEW.office, NEW.updated_by, NEW.category_id, NEW.status, \'UPDATE\', current_timestamp, current_timestamp);
            ELSIF TG_OP = \'DELETE\' THEN
                INSERT INTO faculty_admin_staff_requests_history (request_id, name, created_by, sender_name, date_received_ovcia, start_date, end_date, dts_num, pd_num, suc_num, date_submitted_ched, date_responded_ched, date_approval_ched, by_means, re_entry_plan_future_actions, remarks, office, updated_by, category_id, status, operation, created_at, updated_at)
                VALUES (OLD.id, OLD.name, OLD.created_by, OLD.sender_name, OLD.date_received_ovcia, OLD.start_date, OLD.end_date, OLD.dts_num, OLD.pd_num, OLD.suc_num, OLD.date_submitted_ched, OLD.date_responded_ched, OLD.date_approval_ched, OLD.by_means, OLD.re_entry_plan_future_actions, OLD.remarks, OLD.office, OLD.updated_by, OLD.category_id, OLD.status, \'DELETE\', current_timestamp, current_timestamp);
            END IF;
            RETURN NULL;
            END;
            $$ LANGUAGE plpgsql;
        ');

        // trigger function for student_international_requests
        DB::unprepared('
            CREATE OR REPLACE FUNCTION student_international_requests_trigger_function()
            RETURNS TRIGGER AS $$
            BEGIN
                IF TG_OP = \'INSERT\' THEN
                    INSERT INTO student_international_requests_history (request_id, name, created_by, sender_name, date_received_ovcia, start_date, end_date, dts_num, pd_num, suc_num, date_submitted_ched, date_responded_ched, date_approval_ched, by_means, re_entry_plan_future_actions, remarks, office, updated_by, category_id, status, operation, created_at, updated_at)
                    VALUES (NEW.id, NEW.name, NEW.created_by, NEW.sender_name, NEW.date_received_ovcia, NEW.start_date, NEW.end_date, NEW.dts_num, NEW.pd_num, NEW.suc_num, NEW.date_submitted_ched, NEW.date_responded_ched, NEW.date_approval_ched, NEW.by_means, NEW.re_entry_plan_future_actions, NEW.remarks, NEW.office, NEW.updated_by, NEW.category_id, NEW.status, \'INSERT\', current_timestamp, current_timestamp);
                ELSIF TG_OP = \'UPDATE\' THEN
                    INSERT INTO student_international_requests_history (request_id, name, created_by, sender_name, date_received_ovcia, start_date, end_date, dts_num, pd_num, suc_num, date_submitted_ched, date_responded_ched, date_approval_ched, by_means, re_entry_plan_future_actions, remarks, office, updated_by, category_id, status, operation, created_at, updated_at)
                    VALUES (NEW.id, NEW.name, NEW.created_by, NEW.sender_name, NEW.date_received_ovcia, NEW.start_date, NEW.end_date, NEW.dts_num, NEW.pd_num, NEW.suc_num, NEW.date_submitted_ched, NEW.date_responded_ched, NEW.date_approval_ched, NEW.by_means, NEW.re_entry_plan_future_actions, NEW.remarks, NEW.office, NEW.updated_by, NEW.category_id, NEW.status, \'UPDATE\', current_timestamp, current_timestamp);
                ELSIF TG_OP = \'DELETE\' THEN
                    INSERT INTO student_international_requests_history (request_id, name, created_by, sender_name, date_received_ovcia, start_date, end_date, dts_num, pd_num, suc_num, date_submitted_ched, date_responded_ched, date_approval_ched, by_means, re_entry_plan_future_actions, remarks, office, updated_by, category_id, status, operation, created_at, updated_at)
                    VALUES (OLD.id, OLD.name, OLD.created_by, OLD.sender_name, OLD.date_received_ovcia, OLD.start_date, OLD.end_date, OLD.dts_num, OLD.pd_num, OLD.suc_num, OLD.date_submitted_ched, OLD.date_responded_ched, OLD.date_approval_ched, OLD.by_means, OLD.re_entry_plan_future_actions, OLD.remarks, OLD.office, OLD.updated_by, OLD.category_id, OLD.status, \'DELETE\', current_timestamp, current_timestamp);
                END IF;
                RETURN NULL;
            END;
            $$ LANGUAGE plpgsql;
        ');

        // trigger function for internal_office_process_requests
        DB::unprepared('
            CREATE OR REPLACE FUNCTION internal_office_process_requests_trigger_function()
            RETURNS TRIGGER AS $$
            BEGIN
                IF TG_OP = \'INSERT\' THEN
                    INSERT INTO internal_office_process_requests_history (request_id, name, created_by, sender_name, date_received_ovcia, start_date, end_date, dts_num, pd_num, suc_num, date_submitted_ched, date_responded_ched, date_approval_ched, by_means, re_entry_plan_future_actions, remarks, office, updated_by, category_id, status, operation, created_at, updated_at)
                    VALUES (NEW.id, NEW.name, NEW.created_by, NEW.sender_name, NEW.date_received_ovcia, NEW.start_date, NEW.end_date, NEW.dts_num, NEW.pd_num, NEW.suc_num, NEW.date_submitted_ched, NEW.date_responded_ched, NEW.date_approval_ched, NEW.by_means, NEW.re_entry_plan_future_actions, NEW.remarks, NEW.office, NEW.updated_by, NEW.category_id, NEW.status, \'INSERT\', current_timestamp, current_timestamp);
                ELSIF TG_OP = \'UPDATE\' THEN
                    INSERT INTO internal_office_process_requests_history (request_id, name, created_by, sender_name, date_received_ovcia, start_date, end_date, dts_num, pd_num, suc_num, date_submitted_ched, date_responded_ched, date_approval_ched, by_means, re_entry_plan_future_actions, remarks, office, updated_by, category_id, status, operation, created_at, updated_at)
                    VALUES (NEW.id, NEW.name, NEW.created_by, NEW.sender_name, NEW.date_received_ovcia, NEW.start_date, NEW.end_date, NEW.dts_num, NEW.pd_num, NEW.suc_num, NEW.date_submitted_ched, NEW.date_responded_ched, NEW.date_approval_ched, NEW.by_means, NEW.re_entry_plan_future_actions, NEW.remarks, NEW.office, NEW.updated_by, NEW.category_id, NEW.status, \'UPDATE\', current_timestamp, current_timestamp);
                ELSIF TG_OP = \'DELETE\' THEN
                    INSERT INTO internal_office_process_requests_history (request_id, name, created_by, sender_name, date_received_ovcia, start_date, end_date, dts_num, pd_num, suc_num, date_submitted_ched, date_responded_ched, date_approval_ched, by_means, re_entry_plan_future_actions, remarks, office, updated_by, category_id, status, operation, created_at, updated_at)
                    VALUES (OLD.id, OLD.name, OLD.created_by, OLD.sender_name, OLD.date_received_ovcia, OLD.start_date, OLD.end_date, OLD.dts_num, OLD.pd_num, OLD.suc_num, OLD.date_submitted_ched, OLD.date_responded_ched, OLD.date_approval_ched, OLD.by_means, OLD.re_entry_plan_future_actions, OLD.remarks, OLD.office, OLD.updated_by, OLD.category_id, OLD.status, \'DELETE\', current_timestamp, current_timestamp);
                END IF;
                RETURN NULL;
            END;
            $$ LANGUAGE plpgsql;
        ');

        // trigger function for project_office_management_requests
        DB::unprepared('
            CREATE OR REPLACE FUNCTION project_office_management_requests_trigger_function()
            RETURNS TRIGGER AS $$
            BEGIN
                IF TG_OP = \'INSERT\' THEN
                    INSERT INTO project_office_management_requests_history (request_id, name, created_by, sender_name, date_received_ovcia, start_date, end_date, dts_num, pd_num, suc_num, date_submitted_ched, date_responded_ched, date_approval_ched, by_means, re_entry_plan_future_actions, remarks, office, updated_by, category_id, status, operation, created_at, updated_at)
                    VALUES (NEW.id, NEW.name, NEW.created_by, NEW.sender_name, NEW.date_received_ovcia, NEW.start_date, NEW.end_date, NEW.dts_num, NEW.pd_num, NEW.suc_num, NEW.date_submitted_ched, NEW.date_responded_ched, NEW.date_approval_ched, NEW.by_means, NEW.re_entry_plan_future_actions, NEW.remarks, NEW.office, NEW.updated_by, NEW.category_id, NEW.status, \'INSERT\', current_timestamp, current_timestamp);
                ELSIF TG_OP = \'UPDATE\' THEN
                    INSERT INTO project_office_management_requests_history (request_id, name, created_by, sender_name, date_received_ovcia, start_date, end_date, dts_num, pd_num, suc_num, date_submitted_ched, date_responded_ched, date_approval_ched, by_means, re_entry_plan_future_actions, remarks, office, updated_by, category_id, status, operation, created_at, updated_at)
                    VALUES (NEW.id, NEW.name, NEW.created_by, NEW.sender_name, NEW.date_received_ovcia, NEW.start_date, NEW.end_date, NEW.dts_num, NEW.pd_num, NEW.suc_num, NEW.date_submitted_ched, NEW.date_responded_ched, NEW.date_approval_ched, NEW.by_means, NEW.re_entry_plan_future_actions, NEW.remarks, NEW.office, NEW.updated_by, NEW.category_id, NEW.status, \'UPDATE\', current_timestamp, current_timestamp);
                ELSIF TG_OP = \'DELETE\' THEN
                    INSERT INTO project_office_management_requests_history (request_id, name, created_by, sender_name, date_received_ovcia, start_date, end_date, dts_num, pd_num, suc_num, date_submitted_ched, date_responded_ched, date_approval_ched, by_means, re_entry_plan_future_actions, remarks, office, updated_by, category_id, status, operation, created_at, updated_at)
                    VALUES (OLD.id, OLD.name, OLD.created_by, OLD.sender_name, OLD.date_received_ovcia, OLD.start_date, OLD.end_date, OLD.dts_num, OLD.pd_num, OLD.suc_num, OLD.date_submitted_ched, OLD.date_responded_ched, OLD.date_approval_ched, OLD.by_means, OLD.re_entry_plan_future_actions, OLD.remarks, OLD.office, OLD.updated_by, OLD.category_id, OLD.status, \'DELETE\', current_timestamp, current_timestamp);
                END IF;
                RETURN NULL;
            END;
            $$ LANGUAGE plpgsql;
        ');

        // trigger function for forms
        DB::unprepared('
            CREATE OR REPLACE FUNCTION forms_trigger_function()
            RETURNS TRIGGER AS $$
            BEGIN
                IF TG_OP = \'INSERT\' THEN
                    INSERT INTO forms_history (form_id, title, description, created_by, updated_by, operation, created_at, updated_at)
                    VALUES (NEW.id, NEW.title, NEW.description, NEW.created_by, NEW.updated_by, \'INSERT\', current_timestamp, current_timestamp);
                ELSIF TG_OP = \'UPDATE\' THEN
                    INSERT INTO forms_history (form_id, title, description, created_by, updated_by, operation, created_at, updated_at)
                    VALUES (NEW.id, NEW.title, NEW.description, NEW.created_by, NEW.updated_by, \'UPDATE\', current_timestamp, current_timestamp);
                ELSIF TG_OP = \'DELETE\' THEN
                    INSERT INTO forms_history (form_id, title, description, created_by, updated_by, operation, created_at, updated_at)
                    VALUES (OLD.id, OLD.title, OLD.description, OLD.created_by, OLD.updated_by, \'DELETE\', current_timestamp, current_timestamp);
                END IF;
                RETURN NULL;
            END;
            $$ LANGUAGE plpgsql;
        ');

        //trigger function for form_files
        DB::unprepared('
            CREATE OR REPLACE FUNCTION form_files_trigger_function()
            RETURNS TRIGGER AS $$
            BEGIN
                IF TG_OP = \'INSERT\' THEN
                    INSERT INTO form_files_history (form_file_id, file, file_title, file_description, added_by, updated_by, operation, created_at, updated_at)
                    VALUES (NEW.id, NEW.file, NEW.file_title, NEW.file_description, NEW.added_by, NEW.updated_by, \'INSERT\', current_timestamp, current_timestamp);
                ELSIF TG_OP = \'UPDATE\' THEN
                    INSERT INTO form_files_history (form_file_id, file, file_title, file_description, added_by, updated_by, operation, created_at, updated_at)
                    VALUES (NEW.id, NEW.file, NEW.file_title, NEW.file_description, NEW.added_by, NEW.updated_by, \'UPDATE\', current_timestamp, current_timestamp);
                ELSIF TG_OP = \'DELETE\' THEN
                    INSERT INTO form_files_history (form_file_id, file, file_title, file_description, added_by, updated_by, operation, created_at, updated_at)
                    VALUES (OLD.id, OLD.file, OLD.file_title, OLD.file_description, OLD.added_by, OLD.updated_by, \'DELETE\', current_timestamp, current_timestamp);
                END IF;
                RETURN NULL;
            END;
            $$ LANGUAGE plpgsql;
        ');

        //trigger function for users
        DB::unprepared('
            CREATE OR REPLACE FUNCTION users_trigger_function()
            RETURNS TRIGGER AS $$
            BEGIN
                IF TG_OP = \'INSERT\' THEN
                    INSERT INTO users_history (user_id, firstname, lastname, middlename, suffix, contactnumber, address, age, image, gender, created_by, status, category_id, category_request, email, email_verified_at, password, updated_by, operation, created_at, updated_at)
                    VALUES (NEW.id, NEW.firstname, NEW.lastname, NEW.middlename, NEW.suffix, NEW.contactnumber, NEW.address, NEW.age, NEW.image, NEW.gender, NEW.created_by, NEW.status, NEW.category_id, NEW.category_request, NEW.email, NEW.email_verified_at, NEW.password, NEW.updated_by, \'INSERT\', current_timestamp, current_timestamp);
                ELSIF TG_OP = \'UPDATE\' THEN
                    INSERT INTO users_history (user_id, firstname, lastname, middlename, suffix, contactnumber, address, age, image, gender, created_by, status, category_id, category_request, email, email_verified_at, password, updated_by, operation, created_at, updated_at)
                    VALUES (NEW.id, NEW.firstname, NEW.lastname, NEW.middlename, NEW.suffix, NEW.contactnumber, NEW.address, NEW.age, NEW.image, NEW.gender, NEW.created_by, NEW.status, NEW.category_id, NEW.category_request, NEW.email, NEW.email_verified_at, NEW.password, NEW.updated_by, \'UPDATE\', current_timestamp, current_timestamp);
                ELSIF TG_OP = \'DELETE\' THEN
                    INSERT INTO users_history (user_id, firstname, lastname, middlename, suffix, contactnumber, address, age, image, gender, created_by, status, category_id, category_request, email, email_verified_at, password, updated_by, operation, created_at, updated_at)
                    VALUES (OLD.id, OLD.firstname, OLD.lastname, OLD.middlename, OLD.suffix, OLD.contactnumber, OLD.address, OLD.age, OLD.image, OLD.gender, OLD.created_by, OLD.status, OLD.category_id, OLD.category_request, OLD.email, OLD.email_verified_at, OLD.password, OLD.updated_by, \'DELETE\', current_timestamp, current_timestamp);
                END IF;
                RETURN NULL;
            END;
            $$ LANGUAGE plpgsql;
        ');

        //trigger function for categories
        DB::unprepared('
            CREATE OR REPLACE FUNCTION categories_trigger_function()
            RETURNS TRIGGER AS $$
            BEGIN
                IF TG_OP = \'INSERT\' THEN
                    INSERT INTO categories_history (category_id, name, updated_by, operation, created_at, updated_at)
                    VALUES (NEW.id, NEW.name, NEW.updated_by, \'INSERT\', current_timestamp, current_timestamp);
                ELSIF TG_OP = \'UPDATE\' THEN
                    INSERT INTO categories_history (category_id, name, updated_by, operation, created_at, updated_at)
                    VALUES (NEW.id, NEW.name, NEW.updated_by, \'UPDATE\', current_timestamp, current_timestamp);
                ELSIF TG_OP = \'DELETE\' THEN
                    INSERT INTO categories_history (category_id, name, updated_by, operation, created_at, updated_at)
                    VALUES (OLD.id, OLD.name, OLD.updated_by, \'DELETE\', current_timestamp, current_timestamp);
                END IF;
                RETURN NULL;
            END;
            $$ LANGUAGE plpgsql;
        ');

        //trigger function for offices
        DB::unprepared('
            CREATE OR REPLACE FUNCTION offices_trigger_function()
            RETURNS TRIGGER AS $$
            BEGIN
                IF TG_OP = \'INSERT\' THEN
                    INSERT INTO offices_history (office_id, name, updated_by, operation, created_at, updated_at)
                    VALUES (NEW.id, NEW.name, NEW.updated_by, \'INSERT\', current_timestamp, current_timestamp);
                ELSIF TG_OP = \'UPDATE\' THEN
                    INSERT INTO offices_history (office_id, name, updated_by, operation, created_at, updated_at)
                    VALUES (NEW.id, NEW.name, NEW.updated_by, \'UPDATE\', current_timestamp, current_timestamp);
                ELSIF TG_OP = \'DELETE\' THEN
                    INSERT INTO offices_history (office_id, name, updated_by, operation, created_at, updated_at)
                    VALUES (OLD.id, OLD.name, OLD.updated_by, \'DELETE\', current_timestamp, current_timestamp);
                END IF;
                RETURN NULL;
            END;
            $$ LANGUAGE plpgsql;
        ');

        //trigger function for faculty_admin_staff_requests_files
        DB::unprepared('
            CREATE OR REPLACE FUNCTION faculty_admin_staff_requests_files_trigger_function()
            RETURNS TRIGGER AS $$
            BEGIN
                IF TG_OP = \'INSERT\' THEN
                    INSERT INTO faculty_admin_staff_requests_files_history (file_id, file, file_title, file_description, added_by, updated_by, document_id, operation, created_at, updated_at)
                    VALUES (NEW.id, NEW.file, NEW.file_title, NEW.file_description, NEW.added_by, NEW.updated_by, NEW.document_id, \'INSERT\', current_timestamp, current_timestamp);
                ELSIF TG_OP = \'UPDATE\' THEN
                    INSERT INTO faculty_admin_staff_requests_files_history (file_id, file, file_title, file_description, added_by, updated_by, document_id, operation, created_at, updated_at)
                    VALUES (NEW.id, NEW.file, NEW.file_title, NEW.file_description, NEW.added_by, NEW.updated_by, NEW.document_id, \'UPDATE\', current_timestamp, current_timestamp);
                ELSIF TG_OP = \'DELETE\' THEN
                    INSERT INTO faculty_admin_staff_requests_files_history (file_id, file, file_title, file_description, added_by, updated_by, document_id, operation, created_at, updated_at)
                    VALUES (OLD.id, OLD.file, OLD.file_title, OLD.file_description, OLD.added_by, OLD.updated_by, OLD.document_id, \'DELETE\', current_timestamp, current_timestamp);
                END IF;
                RETURN NULL;
            END;
            $$ LANGUAGE plpgsql;
        ');

        //trigger function for students_international_requests_files
        DB::unprepared('
            CREATE OR REPLACE FUNCTION student_international_requests_files_trigger_function()
            RETURNS TRIGGER AS $$
            BEGIN
                IF TG_OP = \'INSERT\' THEN
                    INSERT INTO student_international_requests_files_history (file_id, file, file_title, file_description, added_by, updated_by, document_id, operation, created_at, updated_at)
                    VALUES (NEW.id, NEW.file, NEW.file_title, NEW.file_description, NEW.added_by, NEW.updated_by, NEW.document_id, \'INSERT\', current_timestamp, current_timestamp);
                ELSIF TG_OP = \'UPDATE\' THEN
                    INSERT INTO student_international_requests_files_history (file_id, file, file_title, file_description, added_by, updated_by, document_id, operation, created_at, updated_at)
                    VALUES (NEW.id, NEW.file, NEW.file_title, NEW.file_description, NEW.added_by, NEW.updated_by, NEW.document_id, \'UPDATE\', current_timestamp, current_timestamp);
                ELSIF TG_OP = \'DELETE\' THEN
                    INSERT INTO student_international_requests_files_history (file_id, file, file_title, file_description, added_by, updated_by, document_id, operation, created_at, updated_at)
                    VALUES (OLD.id, OLD.file, OLD.file_title, OLD.file_description, OLD.added_by, OLD.updated_by, OLD.document_id, \'DELETE\', current_timestamp, current_timestamp);
                END IF;
                RETURN NULL;
            END;
            $$ LANGUAGE plpgsql;
        ');

        // trigger function for internal_office_process_requests_files
        DB::unprepared('
            CREATE OR REPLACE FUNCTION internal_office_process_requests_files_trigger_function()
            RETURNS TRIGGER AS $$
            BEGIN
                IF TG_OP = \'INSERT\' THEN
                    INSERT INTO internal_office_process_requests_files_history (file_id, file, file_title, file_description, added_by, updated_by, document_id, operation, created_at, updated_at)
                    VALUES (NEW.id, NEW.file, NEW.file_title, NEW.file_description, NEW.added_by, NEW.updated_by, NEW.document_id, \'INSERT\', current_timestamp, current_timestamp);
                ELSIF TG_OP = \'UPDATE\' THEN
                    INSERT INTO internal_office_process_requests_files_history (file_id, file, file_title, file_description, added_by, updated_by, document_id, operation, created_at, updated_at)
                    VALUES (NEW.id, NEW.file, NEW.file_title, NEW.file_description, NEW.added_by, NEW.updated_by, NEW.document_id, \'UPDATE\', current_timestamp, current_timestamp);
                ELSIF TG_OP = \'DELETE\' THEN
                    INSERT INTO internal_office_process_requests_files_history (file_id, file, file_title, file_description, added_by, updated_by, document_id, operation, created_at, updated_at)
                    VALUES (OLD.id, OLD.file, OLD.file_title, OLD.file_description, OLD.added_by, OLD.updated_by, OLD.document_id, \'DELETE\', current_timestamp, current_timestamp);
                END IF;
                RETURN NULL;
            END;
            $$ LANGUAGE plpgsql;
        ');

        // trigger function for project_office_management_requests_files
        DB::unprepared('
            CREATE OR REPLACE FUNCTION project_office_management_requests_files_trigger_function()
            RETURNS TRIGGER AS $$
            BEGIN
                IF TG_OP = \'INSERT\' THEN
                    INSERT INTO project_office_management_requests_files_history (file_id, file, file_title, file_description, added_by, updated_by, document_id, operation, created_at, updated_at)
                    VALUES (NEW.id, NEW.file, NEW.file_title, NEW.file_description, NEW.added_by, NEW.updated_by, NEW.document_id, \'INSERT\', current_timestamp, current_timestamp);
                ELSIF TG_OP = \'UPDATE\' THEN
                    INSERT INTO project_office_management_requests_files_history (file_id, file, file_title, file_description, added_by, updated_by, document_id, operation, created_at, updated_at)
                    VALUES (NEW.id, NEW.file, NEW.file_title, NEW.file_description, NEW.added_by, NEW.updated_by, NEW.document_id, \'UPDATE\', current_timestamp, current_timestamp);
                ELSIF TG_OP = \'DELETE\' THEN
                    INSERT INTO project_office_management_requests_files_history (file_id, file, file_title, file_description, added_by, updated_by, document_id, operation, created_at, updated_at)
                    VALUES (OLD.id, OLD.file, OLD.file_title, OLD.file_description, OLD.added_by, OLD.updated_by, OLD.document_id, \'DELETE\', current_timestamp, current_timestamp);
                END IF;
                RETURN NULL;
            END;
            $$ LANGUAGE plpgsql;
        ');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::unprepared('DROP FUNCTION IF EXISTS faculty_admin_staff_requests_trigger_function');

        DB::unprepared('DROP FUNCTION IF EXISTS student_international_requests_trigger_function');

        DB::unprepared('DROP FUNCTION IF EXISTS internal_office_process_requests_trigger_function');

        DB::unprepared('DROP FUNCTION IF EXISTS project_office_management_requests_trigger_function');

        DB::unprepared('DROP FUNCTION IF EXISTS forms_trigger_function');

        DB::unprepared('DROP FUNCTION IF EXISTS form_files_trigger_function');

        DB::unprepared('DROP FUNCTION IF EXISTS users_trigger_function');

        DB::unprepared('DROP FUNCTION IF EXISTS categories_trigger_function');

        DB::unprepared('DROP FUNCTION IF EXISTS offices_trigger_function');
        
        DB::unprepared('DROP FUNCTION IF EXISTS faculty_admin_staff_requests_files_trigger_function');

        DB::unprepared('DROP FUNCTION IF EXISTS student_international_requests_files_trigger_function');

        DB::unprepared('DROP FUNCTION IF EXISTS internal_office_process_requests_files_trigger_function');

        DB::unprepared('DROP FUNCTION IF EXISTS project_office_management_requests_files_trigger_function');
    }
};
