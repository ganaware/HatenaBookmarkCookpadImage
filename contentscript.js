function httpGET(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            callback(xhr);
        }
    }
    xhr.open('GET', url, true);
    xhr.send(null);
    return xhr;
}

function main() {
	var nodesSnapshot = document.evaluate(
		'//a', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var re_cookpad = /^http:\/\/cookpad\.com\/recipe\/([0-9]+)/;
	for (var i = 0; i < nodesSnapshot.snapshotLength; ++ i) {
		(function(){
			var node = nodesSnapshot.snapshotItem(i);
			if (!node.href.match(re_cookpad)) { return; }
			var recipe_id = RegExp.$1;
			var re_url = new RegExp("(http://[^\"\']+/recipes/" + recipe_id + "/280/[^\"\']+\\.jpg)");
			httpGET(node.href, function (xhr) {
				if (!xhr.responseText.match(re_url)) { return; }
				var img_src = RegExp.$1;

				// create node
				var node_img = document.createElement("img");
				$(node_img).addClass('cookpad-img');
				node_img.src = img_src;

				// place node
				node_parent = node.parentNode;
				if (!node_parent) { return; }
				node_parent = node_parent.parentNode;
				if (!node_parent) { return; }
				node_parent.appendChild(node_img);
			});
		})();
	}
}

function wait_loading() {
	if (document.getElementById('page-loading-message')) {
		setTimeout(function() { wait_loading(); }, 500);
	} else {
		main();
	}
}
setTimeout(function() { wait_loading(); }, 500);
