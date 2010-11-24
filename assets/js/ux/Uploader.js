/**
 * a simple file uploader
 * 
 * objects of this class represent a single file uplaod
 */
Uploader = function(config) {
  Ext.apply(this, config);

  Uploader.superclass.constructor.apply(this, arguments);

  this.addEvents(
    /**
     * @event uploadcomplete Fires when the upload was done successfully
     * @param {Uploader}
     *            this
     * @param {Ext.Record}
     *            Uploader.file
     */
    'uploadcomplete',
    /**
     * @event uploadfailure Fires when the upload failed
     * @param {Uploader}
     *            this
     * @param {Ext.Record}
     *            Uploader.file
     */
    'uploadfailure',
    /**
     * @event uploadprogress Fires on upload progress (html5 only)
     * @param {Uploader}
     *            this
     * @param {Ext.Record}
     *            Uploader.file
     * @param {XMLHttpRequestProgressEvent}
     */
    'uploadprogress');
};

Ext.extend(Uploader, Ext.util.Observable, {
  /**
   * @cfg {Int} maxFileSize the maximum file size in bytes
   */
  maxFileSize : 2097152,
  /**
   * @cfg {String} url the url we upload to
   */
  url : null,
  /**
   * @cfg {BrowsePlugin} fileSelector a file selector
   */
  fileSelector : null,

  params : null,

  /**
   * creates a form where the upload takes place in
   * 
   * @private
   */
  createForm : function() {
    var form = Ext.getBody().createChild({
      tag : 'form',
      action : this.url,
      method : 'POST',
      cls : 'x-hidden',
      id : Ext.id(),
      cn : [{
        tag : 'input',
        type : 'hidden',
        name : 'MAX_FILE_SIZE',
        value : this.maxFileSize
      }]
    });
    return form;
  },

  /**
   * perform the upload
   * 
   * @param {FILE}
   *            file to upload (optional for html5 uploads)
   * @return {Ext.Record} Uploader.file
   */
  upload : function(file) {
      if (((!Ext.isGecko && window.XMLHttpRequest && window.File && window.FileList) || // safari,chrome,...?
      (Ext.isGecko && window.FileReader) // FF
      ) && file) {
        return this.html5upload(file);
        //return this.html4upload();
      } else {
        return this.html4upload();
      }
  },

  /**
   * 2010-01-26 Current Browsers implemetation state of:
   * http://www.w3.org/TR/FileAPI
   * 
   * Interface: File | Blob | FileReader | FileReaderSync | FileError FF : yes |
   * no | no | no | no safari : yes | no | no | no | no chrome : yes | no | no |
   * no | no => no json rpc style upload possible => no chunked uploads
   * posible
   * 
   * But all of them implement XMLHttpRequest Level 2:
   * http://www.w3.org/TR/XMLHttpRequest2/ => the only way of uploading is
   * using the XMLHttpRequest Level 2.
   */
  html5upload : function(file) {
    var fileRecord = new Uploader.file({
      // safari
      // and
      // chrome
      // use the non std.
      // fileX props
      name : file.name ? file.name : file.fileName,
      // missing
      // if
      // safari
      // and
      // chrome
      type : (file.type ? file.type : file.fileType)
                      || this.fileSelector.getFileCls(),
      // non
      // standard
      // but all have
      // it ;-)
      size : (file.size ? file.size : file.fileSize) || 0,
      status : 'uploading',
      progress : 0,
      input : this.getInput()
    });

    var boundary = '------multipartformboundary' + (new Date).getTime();
    var dashdash = '--';
    var crlf = '\r\n';

/*
    var conn = new Connection({
      disableCaching : true,
      method : 'HTTP',
      url : this.url,
      defaultHeaders : {
        "Content-Type" : "multipart/form-data; boundary=" + boundary,
        "X-Request-Type" : "HTTP",
        "X-Requested-With" : "XMLHttpRequest"
      }
    });
    */
    var conn = new Ext.data.Connection({
      disableCaching: true,
      method: 'POST',
      url: this.url,
      timeout: 300000, // 5 mins
      defaultHeaders: {
        //"Content-Type" : "multipart/form-data; boundary=" + boundary,
        "Content-Type" : "application/octet-stream",
        //"Content-Type"          : "application/x-www-form-urlencoded",
        "X-Requested-With"      : "XMLHttpRequest"
      }
    });

    var transaction = conn.request({
      headers : {
        "X-File-Name" : fileRecord.get('name'),
        "X-File-Type" : fileRecord.get('type'),
        "X-File-Size" : fileRecord.get('size')
      },
      xmlData : file,
      success : this.onUploadSuccess.createDelegate(this, [fileRecord], true),
      failure : this.onUploadFail.createDelegate(this, [fileRecord], true),
      fileRecord : fileRecord,
      params : this.params,
    });

    var upload = transaction.conn.upload;

    // upload['onloadstart'] = this.onLoadStart.createDelegate(this,
    // [fileRecord], true);
    upload['onprogress'] = this.onUploadProgress.createDelegate(this, [fileRecord], true);

    return fileRecord;
  },

  /**
   * uploads in a html4 fashion
   * 
   * @return {Ext.data.Connection}
   */
  html4upload : function() {
    var form = this.createForm();
    var input = this.getInput();
    form.appendChild(input);

    var fileRecord = new Uploader.file({
      name : this.fileSelector.getFileName(),
      size : 0,
      type : this.fileSelector.getFileCls(),
      input : input,
      form : form,
      status : 'uploading',
      progress : 0
    });

    Ext.Ajax.request({
      fileRecord : fileRecord,
      isUpload : true,
      method : 'post',
      form : form,
      success : this.onUploadSuccess.createDelegate(this, [fileRecord], true),
      failure : this.onUploadFail.createDelegate(this, [fileRecord], true),
      params : this.params
    });

    return fileRecord;
  },

  /*
   * onLoadStart: function(e, fileRecord) { this.fireEvent('loadstart', this,
   * fileRecord, e); },
   */

  onUploadProgress : function(e, fileRecord) {
    var percent = Math.round(e.loaded / e.total * 100);
    fileRecord.set('progress', percent);
    this.fireEvent('uploadprogress', this, fileRecord, e);
  },

  /**
   * executed if a file got uploaded successfully
   */
  onUploadSuccess : function(response, options, fileRecord) {
    response = Ext.util.JSON.decode(response.responseText);
    if (response.status && response.status !== 'success') {
        this.onUploadFail(response, options, fileRecord);
    } else {
      fileRecord.beginEdit();
      /*
      fileRecord.set('status', 'complete');
      fileRecord.set('tempFile', response.tempFile);
      fileRecord.set('name', response.tempFile.name);
      fileRecord.set('size', response.tempFile.size);
      fileRecord.set('type', response.tempFile.type);
      fileRecord.set('path', response.tempFile.path);
      */
      fileRecord.commit(false);
      this.fireEvent('uploadcomplete', this, fileRecord);
    }
  },

  /**
   * executed if a file upload failed
   */
  onUploadFail : function(response, options, fileRecord) {
    fileRecord.set('status', 'failure');

    this.fireEvent('uploadfailure', this, fileRecord);
  },

  // private
  getInput : function() {
    if (!this.input) {
      this.input = this.fileSelector.detachInputFile();
    }

    return this.input;
  }
});

Uploader.file = Ext.data.Record.create([{
    name : 'id',
    type : 'text',
    system : true
  }, {
    name : 'name',
    type : 'text',
    system : true
  }, {
    name : 'size',
    type : 'number',
    system : true
  }, {
    name : 'type',
    type : 'text',
    system : true
  }, {
    name : 'status',
    type : 'text',
    system : true
  }, {
    name : 'progress',
    type : 'number',
    system : true
  }, {
    name : 'form',
    system : true
  }, {
    name : 'input',
    system : true
  }, {
    name : 'request',
    system : true
  }, {
    name : 'path',
    system : true
  }, {
    name : 'tempFile',
    system : true
}]);