var bgpage = chrome.extension.getBackgroundPage();


function getTasks() {
	try {
		/*
		tasks-> [{'id':'','query_name':'','min_price':'','max_price':'','status':'', 'count':''}]
			=>.'status' -> 0:暂停,1:启用
		*/
		var tasks = loadTasks()
	} catch (error) {
		console.log(error);
	}
	var div_table = document.getElementById('table'),
		table = document.createElement('table'),
		thead = document.createElement('thead'),
		tbody = document.createElement('tbody'),
		tr = document.createElement('tr'),
		name = document.createElement('th'),
		duration = document.createElement('th'),
		count = document.createElement('th'),
		operate = document.createElement('th')
	div_table.innerHTML = null
	tbody.id = 'tbody'
	thead.id = 'thead'

	name.innerHTML = 'NFT 名称'
	duration.innerHTML = '价格区间'
	count.innerHTML = '满足的数量'
	operate.innerHTML = '操作'
	tr.appendChild(name)
	tr.appendChild(duration)
	tr.appendChild(count)
	tr.appendChild(operate)
	thead.appendChild(tr)
	table.appendChild(thead)
	try {
		tasks.forEach(function (item, index) {
			var new_tr = document.createElement('tr')
			new_tr.id = 'new_tr' + index

			var new_td_name = document.createElement('td')
			new_td_name.id = 'new_td_name' + index
			new_td_name.innerHTML = item.query_name
			new_tr.appendChild(new_td_name)

			var new_td_min = document.createElement('td')
			new_td_min.id = 'new_td_min' + index
			new_td_min.innerHTML = Number(item.min_price).toFixed(4) + ' to ' + Number(item.max_price).toFixed(4)
			new_tr.appendChild(new_td_min)

			var new_td_count = document.createElement('td')
			new_td_count.id = 'new_td_count' + index
			new_td_count.innerHTML = Number(item.count).toFixed(0)
			if (Number(item.count > 0)) {
				var new_a_count_href = document.createElement('a')
				new_a_count_href.id = 'new_a_count' + index
				new_a_count_href.value = "详情"
				new_a_count_href.href = "http://www.google.com"
				new_td_count.appendChild(new_a_count_href)
			}
			new_tr.appendChild(new_td_count)

			var new_td_operate = document.createElement('td')
			new_td_operate.id = 'new_td_operate' + index
			if (Number(item.status) === 0) {
				var new_button_turn_on = document.createElement('button')
				new_button_turn_on.id = 'new_button_turn_on' + index
				new_button_turn_on.innerHTML = "开启监控"
				new_td_operate.appendChild(new_button_turn_on)
			}
			else if (Number(item.status) === 1) {
				var new_button_turn_off = document.createElement('button')
				new_button_turn_off.id = 'new_button_turn_off' + index
				new_button_turn_off.innerHTML = "关闭监控"
				new_td_operate.appendChild(new_button_turn_off)
			}
			var new_button_remove = document.createElement('button')
			new_button_remove.id = 'new_button_remove' + index
			new_button_remove.innerHTML = "移除监控"
			new_td_operate.appendChild(new_button_remove)
			new_tr.appendChild(new_td_operate)

			tbody.appendChild(new_tr)
		})
		table.appendChild(tbody)
		div_table.appendChild(table)
	} catch (error) {
		console.log(error);
	}
}

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
	localStorage.upstairs_helper_tasks = JSON.stringify(tasks);
}

function startTasks() {
	var tasks = loadTasks()
	if (tasks) {
		bgpage.startTasks();
	}
}

setInterval(function () { getTasks(); }, 5000);

document.getElementById('addBtn').onclick = function () {
	var add = document.getElementById('add'),
		addBtn = document.getElementById('addBtn');

	var collection_name = document.createElement('input');
	collection_name.id = 'collection_name';
	collection_name.value = 'RNG LEGEND™ NFT (MID)';


	var min_price = document.createElement('input');
	min_price.id = 'min_price';
	min_price.value = '100';

	var max_price = document.createElement('input');
	max_price.id = 'max_price';
	max_price.value = '130';


	var saveBtn = document.createElement('button');
	saveBtn.id = 'saveBtn';
	saveBtn.innerHTML = 'save';

	let newDiv1 = document.createElement("div");
	let newDiv2 = document.createElement("div");
	let newDiv3 = document.createElement("div");
	let newDiv4 = document.createElement("div");
	newDiv1.appendChild(collection_name);
	newDiv2.appendChild(min_price);
	newDiv3.appendChild(max_price);
	newDiv4.appendChild(saveBtn);

	add.removeChild(addBtn);
	add.appendChild(newDiv1);
	add.appendChild(newDiv2);
	add.appendChild(newDiv3);
	add.appendChild(newDiv4);

	document.getElementById('saveBtn').onclick = function () {
		var collection_name_value = document.getElementById('collection_name').value;
		var min_price_value = document.getElementById('min_price').value;
		var max_price_value = document.getElementById('max_price').value;

		var task = { 'id': '', 'query_name': collection_name_value, 'min_price': min_price_value, 'max_price': max_price_value, 'status': 1, 'count': 0 };
		var same_flag = false;
		try {
			/*
			tasks-> [{'id':'','query_name':'','min_price':'','max_price':'','status':''}]
				=>.'status' -> 0:暂停,1:启用
			*/
			if (localStorage.upstairs_helper_tasks) {
				var tasks = JSON.parse(localStorage.upstairs_helper_tasks)
				task.id = tasks.length + 1


				tasks.forEach(function (item) {
					if (item.query_name + item.min_price + item.max_price === collection_name_value + min_price_value + max_price_value) {
						same_flag = true;
					}
				})

			}
			else {
				var tasks = []
				task.id = 1
			}
		} catch (error) {
			console.log(error);
		}

		if (tasks.length && !same_flag) {
			tasks.push(task)
		}
		else if (!same_flag) {
			tasks = [task]
		}

		updateTasks(tasks)

		add.removeChild(newDiv1);
		add.removeChild(newDiv2);
		add.removeChild(newDiv3);
		add.removeChild(newDiv4);
		add.appendChild(addBtn);
		getTasks();
	}
}


function turnOn() {
	// try {
	// 	var tasks = loadTasks()
	// 	tasks[index].status = 1
	// 	updateTasks(tasks)
	// } catch (error) {
	// 	console.log(error);
	// }
	console.log("task_turnon logout")
}


function turnOff() {
	console.log("task_turnon logout")
}

function remove() {
}

document.addEventListener('DOMContentLoaded', function () {
	document.querySelector('#start').addEventListener('click', startTasks);
	// document.querySelector('#task_turnon').addEventListener('click', turnSwitch);
	// document.querySelector('#task_remove').addEventListener('click', remove);

});

