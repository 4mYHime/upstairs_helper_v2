var bgpage = chrome.extension.getBackgroundPage();


function getTasks() {
	var table = "<table><thead><tr><th>NFT名称</th><th>价格区间</th><th>操作</th></tr></thead><tbody>";
	try {
		/*
		tasks-> [{'id':'','query_name':'','min_price':'','max_price':'','status':''}]
			=>.'status' -> 0:暂停,1:启用
		*/
		var tasks = loadTasks()
	} catch (error) {
		console.log(error);
	}

	try {
		tasks.forEach(function(item){
			table += '<tr>';
			table += '<td>' + item.query_name + '</td>';
			table += '<td>' + Number(item.min_price).toFixed(4) + ' to ' + Number(item.max_price).toFixed(4) + '</td>';
			table += '<td>' + '操作' + '</td>';
			table += '</tr>';
		})
		table += '</tbody></table>';
		document.getElementById('stock').innerHTML = table;
	} catch (error) {
		console.log(error);
		table += '</tbody></table>';
		document.getElementById('stock').innerHTML = table;
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

function startTasks()
{
	var tasks = loadTasks()
	if (tasks) {
		bgpage.startTasks();
	}
}

setInterval(function() {getTasks();}, 5000);

document.getElementById('addBtn').onclick = function() {
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

	document.getElementById('saveBtn').onclick = function() {
		var collection_name_value= document.getElementById('collection_name').value;
		var min_price_value = document.getElementById('min_price').value;
		var max_price_value = document.getElementById('max_price').value;

		var task = {'id': '','query_name': collection_name_value,'min_price': min_price_value,'max_price': max_price_value,'status': 1};
		var same_flag = false;
		try {
			/*
			tasks-> [{'id':'','query_name':'','min_price':'','max_price':'','status':''}]
				=>.'status' -> 0:暂停,1:启用
			*/
			if (localStorage.upstairs_helper_tasks) {
				var tasks = JSON.parse(localStorage.upstairs_helper_tasks)
				task.id = tasks.length + 1


				tasks.forEach(function(item){
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
		
		localStorage.upstairs_helper_tasks =  JSON.stringify(tasks);

		add.removeChild(newDiv1);
		add.removeChild(newDiv2);
		add.removeChild(newDiv3);
		add.removeChild(newDiv4);
		add.appendChild(addBtn);
		getTasks();
	}
}


document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#start').addEventListener('click', startTasks);
	
});
