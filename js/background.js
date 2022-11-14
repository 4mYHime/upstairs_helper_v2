function loadTasks() {
	if (localStorage.upstairs_helper_tasks) {
		var tasks = JSON.parse(localStorage.upstairs_helper_tasks)
	}
	else {
		var tasks = []
	}
	return tasks
}

function updateTasks(tasks) {
	localStorage.upstairs_helper_tasks =  JSON.stringify(tasks);
}

function refreshTasks(index, count) {
	tasks = loadTasks()
	if (tasks.length) {
		// 从任务中去除该条记录
		// tasks.pop(index)
		tasks[index].count = count
		updateTasks(tasks)
	}
}

function checkTasksRuning() {
	if (localStorage.upstairs_helper_running_code) {
		return true;
	}
	else {
		return false;
	}
}

function startTasks() {
	if (!checkTasksRuning()) {
		localStorage.upstairs_helper_running_code = setInterval(function() {
			try {
				httpRequest(checkResult);
			} catch (error) {
				console.log(error)
			}
		}, 5000);
		
	}
}


function httpRequest(callback) {
	var url = 'https://core-api-prod.upstairs.io/orders?page=1&page_size=99999&sort=lowest&type=1';
	var xhr = new XMLHttpRequest();
	var tasks = loadTasks();
	if (tasks.length) {
		tasks.forEach(function(item, index){
			request_url = url + '&min_price=' + Number(item.min_price).toFixed(4) + '&max_price=' + Number(item.max_price).toFixed(4) + '&name=' + encodeURIComponent(item.query_name).replace(/\-/g, "%2D").replace(/\_/g, "%5F").replace(/\./g, "%2E").replace(/\!/g, "%21").replace(/\~/g, "%7E").replace(/\*/g, "%2A").replace(/\'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29")
			xhr.open("GET", request_url, true);
		
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					callback(result=xhr.response, index=index);
				}
			}
			xhr.send();
		})
	}
}

function notify(notification_content) {
    // 检查浏览器是否支持 Notification
    if (!("Notification" in window)) {
        alert("浏览器不支持提醒!");
    }

    // 检查用户是否已经允许使用通知
    else if (Notification.permission === "granted") {
        // 创建 Notification
        var notification = new Notification(notification_content);
        autoClose(notification);

    }

    // 重新发起请求，让用户同意使用通知
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {

            // 用户同意使用通知
            if (!('permission' in Notification)) {
                Notification.permission = permission;
            }

            if (permission === "granted") {
                // 创建 Notification
                var notification = new Notification(notification_content);
            }
        });
    }
    // 注意：如果浏览器禁止弹出任何通知，将无法使用
}

function autoClose(notification) {
    if (typeof notification.time === 'undefined' || notification.time <= 0) {
        notification.close();
    } else {
        setTimeout(function () {
            notification.close();
        }, notification.time);
    }

    notification.addEventListener('click', function () {
        notification.close();
    }, false)
}

function checkResult(result, index) {
	try {
		var response = JSON.parse(result)
		if (response.list.length > 0) {
			notify("查询到满足条件的出售单！");
			refreshTasks(index, response.list.length)
		}
	} catch (error) {}
}

