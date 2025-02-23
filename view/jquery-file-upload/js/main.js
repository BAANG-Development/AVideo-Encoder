/*
 * jQuery File Upload Plugin JS Example
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/* global $, window */

$(function () {
    'use strict';

    // Initialize the jQuery File Upload widget:
    $('#fileupload').fileupload({
        // Uncomment the following to send cross-domain cookies:
        //xhrFields: {withCredentials: true},
        url: 'view/jquery-file-upload/server/php/?PHPSESSID=' + PHPSESSID,
        maxChunkSize: 5000000, // 5 MB
        add: function (e, data) {
            var videos_id = $('#update_video_id').val();
            var that = this;
            if (videos_id) {
                swal({
                    title: "You will overwrite the video ID: " + videos_id,
                    text: "The video will be replaced with this new file, are you sure you want to proceed?",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                        .then(function (confirm) {
                            if (confirm) {
                                $.getJSON('view/jquery-file-upload/server/php/', {file: data.files[0].name, PHPSESSID: PHPSESSID}, function (result) {
                                    var file = result.file;
                                    data.uploadedBytes = file && file.size;
                                    $.blueimp.fileupload.prototype
                                            .options.add.call(that, e, data);
                                });
                            }
                        });
            } else {
                $.getJSON('view/jquery-file-upload/server/php/', {file: data.files[0].name, PHPSESSID: PHPSESSID}, function (result) {
                    var file = result.file;
                    data.uploadedBytes = file && file.size;
                    $.blueimp.fileupload.prototype
                            .options.add.call(that, e, data);
                });
            }


        },
        maxRetries: 100,
        retryTimeout: 500,
        fail: function (e, data) {
            // jQuery Widget Factory uses "namespace-widgetname" since version 1.10.0:
            var fu = $(this).data('blueimp-fileupload') || $(this).data('fileupload'),
                    retries = data.context.data('retries') || 0,
                    retry = function () {
                        $.getJSON('view/jquery-file-upload/server/php/', {file: data.files[0].name, PHPSESSID: PHPSESSID})
                                .done(function (result) {
                                    var file = result.file;
                                    data.uploadedBytes = file && file.size;
                                    // clear the previous data:
                                    data.data = null;
                                    data.submit();
                                })
                                .fail(function () {
                                    fu._trigger('fail', e, data);
                                });
                    };
            if (data.errorThrown !== 'abort' &&
                    data.uploadedBytes < data.files[0].size &&
                    retries < fu.options.maxRetries) {
                retries += 1;
                data.context.data('retries', retries);
                window.setTimeout(retry, retries * fu.options.retryTimeout);
                return;
            }
            data.context.removeData('retries');
            $.blueimp.fileupload.prototype
                    .options.fail.call(this, e, data);
        }
    });

    // Enable iframe cross-domain access via redirect option:
    $('#fileupload').fileupload(
            'option',
            'redirect',
            window.location.href.replace(
                    /\/[^\/]*$/,
                    '/cors/result.html?%s'
                    )
            );

    if (window.location.hostname === 'blueimp.github.io') {
        // Demo settings:
        $('#fileupload').fileupload('option', {
            url: '//jquery-file-upload.appspot.com/',
            // Enable image resizing, except for Android and Opera,
            // which actually support image resizing, but fail to
            // send Blob objects via XHR requests:
            disableImageResize: /Android(?!.*Chrome)|Opera/
                    .test(window.navigator.userAgent),
            maxFileSize: 999000,
            acceptFileTypes: /(\.|\/)(mp4|avi|mov|flv|mp3|wav|m4v|webm|wmv|mpg|mpeg|f4v|m4v|m4a|m2p|rm|vob|mkv|3gp)$/i
        });
        // Upload server status check for browsers with CORS support:
        if ($.support.cors) {
            $.ajax({
                url: '//jquery-file-upload.appspot.com/',
                type: 'HEAD'
            }).fail(function () {
                $('<div class="alert alert-danger"/>')
                        .text('Upload server currently unavailable - ' +
                                new Date())
                        .appendTo('#fileupload');
            });
        }
    } else {
        // Load existing files:
        $('#fileupload').addClass('fileupload-processing');
        $.ajax({
            // Uncomment the following to send cross-domain cookies:
            //xhrFields: {withCredentials: true},
            url: $('#fileupload').fileupload('option', 'url'),
            dataType: 'json',
            context: $('#fileupload')[0]
        }).always(function () {
            $(this).removeClass('fileupload-processing');
        }).done(function (result) {
            $(this).fileupload('option', 'done')
                    .call(this, $.Event('done'), {result: result});
        });
    }
    $('#fileupload').bind('fileuploadsubmit', function (e, data) {
        data.formData = {
            "audioOnly": $('#inputAudioOnly').is(":checked"),
            "spectrum": $('#inputAudioSpectrum').is(":checked"),
            "webm": $('#inputWebM').is(":checked"),
            "override_status": $('#override_status').val(),
            "update_video_id": $('#update_video_id').val(),
            "inputHLS": $('#inputHLS').is(":checked"),
            "inputLow": $('#inputLow').is(":checked"),
            "inputSD": $('#inputSD').is(":checked"),
            "inputHD": $('#inputHD').is(":checked"),
            "inputAutoHLS": $('#inputAutoHLS').is(":checked"),
            "inputAutoMP4": $('#inputAutoMP4').is(":checked"),
            "inputAutoWebm": $('#inputAutoWebm').is(":checked"),
            "inputAutoAudio": $('#inputAutoAudio').is(":checked"),
            "title": $('#title').val(),
            "description": $('#description').val(),
            "categories_id": $('#categories_id').val(),
            "callback": $('#callback').val(),
            "usergroups_id": $(".usergroups_id:checked").map(function () {
                return $(this).val();
            }).get(),
            PHPSESSID: PHPSESSID
        };
    }).bind('fileuploaddone', function (e, data) {
        //console.log(e);
        //console.log(data);
        
        console.log('fileuploaddone',  data.result.files);
        $.ajax({
            url: 'view/jquery-file-upload/server/php/fileuploadchunkdone.php?PHPSESSID=' + PHPSESSID,
            data: {
                "file": data.result.files[0].name,
                "audioOnly": $('#inputAudioOnly').is(":checked"),
                "spectrum": $('#inputAudioSpectrum').is(":checked"),
                "webm": $('#inputWebM').is(":checked"),
                "override_status": $('#override_status').val(),
                "update_video_id": $('#update_video_id').val(),
                "inputHLS": $('#inputHLS').is(":checked"),
                "inputLow": $('#inputLow').is(":checked"),
                "inputSD": $('#inputSD').is(":checked"),
                "inputHD": $('#inputHD').is(":checked"),
                "inputAutoHLS": $('#inputAutoHLS').is(":checked"),
                "inputAutoMP4": $('#inputAutoMP4').is(":checked"),
                "inputAutoWebm": $('#inputAutoWebm').is(":checked"),
                "inputAutoAudio": $('#inputAutoAudio').is(":checked"),
                "title": $('#title').val(),
                "description": $('#description').val(),
                "categories_id": $('#categories_id').val(),
                "releaseDate": $('#releaseDate').val(),
                "callback": $('#callback').val(),
                "usergroups_id": $(".usergroups_id:checked").map(function () {
                    return $(this).val();
                }).get(),
                PHPSESSID: PHPSESSID
            },
            type: 'post',
            success: function (response) {
                console.log(response);
            }
        });
    });
});
