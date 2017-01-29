$.router.add('/podcast/:item', function(data) {
	podcast.getPodcastEpisodes(data.item);
});

$.router.add('/podcast/:item/episode/:epid', function(data) {
	console.log("ID: " , data.epid);
	podcast.showPod(data.epid, data.item);
});

$.router.add('/podcast', function(data) {
	podcast.drawIndex();
});