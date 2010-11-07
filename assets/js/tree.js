/*!
 * Ext JS Library 3.3.0
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
Ext.onReady(function() {
    Ext.QuickTips.init();

    var tree = new Ext.ux.tree.TreeGrid({
        title: 'Files',
        width: 940,
        autoHeight: true,
        renderTo: 'content-panel',
        enableDD: true,
        dataUrl: 'browse/getall',
        selModel: new Ext.tree.MultiSelectionModel(),
        columns:[
        {
            header: 'Name',
            dataIndex: 'name',
            width: 250
        },{
            header: 'Description',
            dataIndex: 'description',
            width: 500,
            id: 'description'
        },{
            header: 'Size',
            width: 100,
            dataIndex: 'size',
            align: 'right',
        },{
            header: 'Perm',
            width: 50,
            dataIndex: 'perm'
        }],
        autoExpandColumn: 'description',
        tbar: [
        {
            text: 'Test'
        },{
            text: 'Pansen'
        }]
    });
});