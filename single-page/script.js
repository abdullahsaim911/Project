$(document).ready(function() {
    const API_URL = 'https://jsonplaceholder.typicode.com/posts';

    const jobList = $('#jobList');
    const loader = $('#loader');
    const modal = new bootstrap.Modal(document.getElementById('jobModal'));
    const form = $('#jobForm');
    const modalTitle = $('#modalTitle');
    const jobIdField = $('#jobId');
    const jobTitleField = $('#jobTitle');
    const jobDescriptionField = $('#jobDescription');

    const showLoader = () => loader.show();
    const hideLoader = () => loader.hide();

    function showAlert(message, type = 'success') {
        const alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        const alertElement = $(alertHtml).appendTo('#alertContainer');
        setTimeout(() => alertElement.fadeOut(500, () => alertElement.remove()), 4000);
    }

    function renderJob(job) {
        return `
            <div class="col-md-6 col-lg-4" data-job-id="${job.id}">
                <div class="job-card h-100">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0 text-truncate">#${job.id} - ${job.title}</h5>
                    </div>
                    <div class="card-body">
                        <p class="card-text">${job.body}</p>
                    </div>
                    <div class="card-footer text-end">
                        <button class="btn btn-sm btn-outline-secondary edit-btn" 
                                data-id="${job.id}" 
                                data-title="${job.title}" 
                                data-body="${job.body}">
                            Edit
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${job.id}">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function fetchJobs() {
        showLoader();
        jobList.empty();

        $.ajax({
            url: API_URL,
            method: 'GET',
            success: function(jobs) {
                jobs.slice(0, 12).forEach(job => {
                    jobList.append(renderJob(job));
                });
            },
            error: function() {
                showAlert('Error: Could not fetch jobs from the server.', 'danger');
            },
            complete: function() {
                hideLoader();
            }
        });
    }

    form.on('submit', function(e) {
        e.preventDefault();
        const jobId = jobIdField.val();
        const jobData = {
            title: jobTitleField.val(),
            body: jobDescriptionField.val(),
            userId: 1
        };

        const isUpdate = jobId !== '';
        const url = isUpdate ? `${API_URL}/${jobId}` : API_URL;
        const method = isUpdate ? 'PUT' : 'POST';

        $.ajax({
            url: url,
            method: method,
            contentType: 'application/json',
            data: JSON.stringify(jobData),
            success: function(response) {
                modal.hide();
                if (isUpdate) {
                    const cardToUpdate = $(`[data-job-id="${jobId}"]`);
                    response.id = jobId; 
                    cardToUpdate.replaceWith(renderJob(response));
                    showAlert('Job updated successfully!');
                } else {
                    jobList.prepend(renderJob(response));
                    showAlert('Job created successfully!');
                }
            },
            error: function() {
                showAlert(`Error: Could not ${isUpdate ? 'update' : 'create'} job.`, 'danger');
            }
        });
    });

    jobList.on('click', '.edit-btn', function() {
        const btn = $(this);
        const id = btn.data('id');
        const title = btn.data('title');
        const body = btn.data('body');

        modalTitle.text('Edit Job');
        jobIdField.val(id);
        jobTitleField.val(title);
        jobDescriptionField.val(body);
        
        modal.show();
    });

    jobList.on('click', '.delete-btn', function() {
        const btn = $(this);
        const jobId = btn.data('id');

        if (confirm('Are you sure you want to delete this job?')) {
            $.ajax({
                url: `${API_URL}/${jobId}`,
                method: 'DELETE',
                success: function() {
                    btn.closest('.col-md-6').fadeOut(500, function() {
                        $(this).remove();
                    });
                    showAlert('Job deleted successfully!');
                },
                error: function() {
                    showAlert('Error: Could not delete job.', 'danger');
                }
            });
        }
    });
    
    $('#addNewJobBtn').on('click', function() {
        form[0].reset(); 
        jobIdField.val(''); 
        modalTitle.text('Add New Job');
        modal.show();
    });

    fetchJobs();
});