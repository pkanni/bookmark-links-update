function flatten(tree) {
	var list = [];
	tree.forEach(function(bitem) {
		if (bitem.url) {
			list.push(bitem);
		}
		if (bitem.children) {
			list = list.concat(flatten(bitem.children));
		}
	});
	return list;
}

function replaceBookmarkUrl() {
	chrome.bookmarks.getTree(function(bookmarkTree) {
		var blist = flatten(bookmarkTree[0].children);		
		var findss = document.getElementById("oldurlss").value;
		var replacess = document.getElementById("newurlss").value;
		var found_blist = [];
		blist.forEach(function(bItem) {
			var found = bItem.url.search(findss);
			if (found >= 0) {
				found_blist.push(bItem);
			}
		});
		
		if (found_blist.length==0) {
			var message = "No bookmarked URL links have\n" + findss + "\n\nCheck old bookmarked url once again.\n";
			confirm(message);
		} else if (found_blist.length > 0) {
			var message = "Found " + found_blist.length + " bookmark urls to edit.\n\nCan I begin editing?";
			if (confirm(message)) {
				found_blist.forEach(function(bItem) {
					var pos = bItem.url.search(findss);
					if (pos >= 0) {
						var newurl = bItem.url.substr(0, pos)+replacess+bItem.url.substr(pos+findss.length, bItem.url.length);						
						chrome.bookmarks.update(bItem.id, {'title' : bItem.title, 'url' : newurl}, function(){});
					}
				});
			}
		}
	});
}

window.addEventListener("load", function() {
	document.getElementById("replaceBtn").addEventListener("click", function(e) {
		e.preventDefault();
		replaceBookmarkUrl();
	});
});