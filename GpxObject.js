var gpxObject = function(){
	this.doc = document.implementation.createDocument("", "", null);
	this.doc.appendChild(this.createElement('gpx',false,this.documentMeta));
	this.tracks = [];
	this.currentTrack = 0;
	this.currentTrackSeg = 0;

}
gpxObject.prototype = {
	documentMeta : {
		xmlns : 'http://www.topografix.com/GPX/1/1',
		'xmlns:gpxx' : 'http://www.garmin.com/xmlschemas/GpxExtensions/v3" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1',
		creator : 'gpxObject',
		version : 1.1,
		'xmlns:xsi' : 'http://www.w3.org/2001/XMLSchema-instance',
		'xsi:schemaLocation' : 'http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd'
	},
	createElement : function(name,value,attrs){
		var newEle = this.doc.createElement(name);
		if(value) newEle.innerHTML = value;
		if(attrs) {
			for(attr in attrs){
				newEle.setAttribute(attr,attrs[attr]);
			}
		}
		return newEle;
	},
	createTrack : function(name){
		var newTrack = this.createElement('trk');
		newTrack.appendChild(this.createElement('name',name));
		newTrack.appendChild(this.createElement('trkseg'));
		this.currentTrack = this.tracks.length -1;
		this.doc.apendChild(newTrack);
		return this;
	},
	createTrackSegment : function(){
		this.getCurrentTrack().appendChild(this.createElement('trkseg'));
		return this;
	},
	createPoint : function(position){
		var coords = position.coords;
		var point = this.createElement('trkpt',false,{
			lat : coords.latitude,
			lon : coords.longitude
		});
		
		point.appendChild(this.createElement('ele',coords.altitude));
		point.appendChild(this.createElement('time',this.getIsoDateString(new Date(position.timestamp))));
		this.getCurrentTrackSegment().appendChild(point);
	},
	getCurrentTrack : function(){
		return this.doc.getElementsByTagName('trk')[this.currentTrack];
	},
	getCurrentTrackSegment : function(){
		return this.getCurrentTrack().getElementsByTagName('trkseg')[this.currentTrackSeg];
	},
	getIsoDateString : function(d){
		function pad(n){return n<10 ? '0'+n : n}
		return d.getUTCFullYear()+'-'
		+ pad(d.getUTCMonth()+1)+'-'
		+ pad(d.getUTCDate())+'T'
		+ pad(d.getUTCHours())+':'
		+ pad(d.getUTCMinutes())+':'
		+ pad(d.getUTCSeconds())+'Z';
	},
	toString : function(){
		try{
			return (new XMLSerializer()).serializeToString(this.doc);
		} catch(e) {
			return "<gpx></gpx>";
		}
	}
	
}

