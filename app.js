
//BUDGET CONTROLER
var budgetController = (function(){

	var Expense = function(id, description , value){
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};
	
	Expense.prototype.calcPercentage = function(totalIncome){
		if(totalIncome > 0){
			this.percentage = Math.round((this.value / totalIncome) * 100);
		}
		else{
			this.percentage = -1;
		}
		
	};
	
	Expense.prototype.getPercentage = function(){
		return this.percentage;
	}
	var Income = function(id, description , value){
		this.id = id;
		this.description = description;
		this.value = value; 
	};
	
	var CalculateTotal = function(type){
		var sum = 0 ;
		data.allItem[type].forEach(function(current){
					sum = sum + current.value;
				});
		data.total[type] = sum;
		
	};
	var data ={
		
		allItem:{    // we can store all data here
			exp : [],
	    	inc : []
			},
		
		total : { // total amount with sub and sum
		exp : 0,
		inc : 0
	},
		budget : 0,
		percentage : -1
	};
						
		return{
			addItem : function(type, des , val){
				
			var newItem, ID ;
			//creat new ID
				if(data.allItem[type].length > 0){
				ID = data.allItem[type][data.allItem[type].length -1].id + 1;
				}
				else{
					ID = 0;
				}
					
			// creat new iteam base on inc or exp
			if(type === 'exp'){
				newItem = new Expense(ID, des , val);
			}
			else if(type === 'inc'){
				newItem = new Income(ID, des , val);
			}
			
			// push new iteam into data sctructure
			data.allItem[type].push(newItem);
					
			//return new element
			return newItem;
				},
			
			deleteItem : function(type , id){
			
				var ids, index;
				
				 ids = data.allItem[type].map(function(current){
					return current.id;
				
				});
				index = ids.indexOf(id);
				
				if(index !== -1){
					data.allItem[type].splice(index,1);
				}
				
			},
			
			calculateBudget : function(){
				
				// calc  sum income and expense
				CalculateTotal('exp');
				CalculateTotal('inc');
				
				
				// calc budget income - expense 
				 data.budget = data.total.inc - data.total.exp;
			
				// calc pesent of income that we spent
				
				if(data.total.inc > 0){
				data.percentage = Math.round((data.total.exp * 100)/ data.total.inc);
				}
				else{
				data.percentage = -1;
				}
				
				
			},
			calculatePercentage : function(){
				data.allItem.exp.forEach(function(current){
				current.calcPercentage(data.total.inc);
				
				});
				
			},
			
			getPercentages : function(){
				var allPer = data.allItem.exp.map(function(current){
					return current.getPercentage();
				});
				return allPer;
			},
			getBudget : function(){
				return{
					budget : data.budget,
					totalInc : data.total.inc,
					totalExp : data.total.exp,
					percentage : data.percentage
				}
			},
			testing :function(){
				console.log(data);
			}

			};
	
})();


//UI CONTROLER
var UIController = ( function(){
	
	var DOMstrings = {
	inputType : '.add__type',
	inputDescription : '.add__description',
	inputValue : '.add__value',
	inputBtn : '.add__btn',
	expenceContainer:'.expenses__list',
	incomeContainer:'.income__list',
	budgetLabel : '.budget__value',
	incomeLable : '.budget__income--value',
	expenseLable : '.budget__expenses--value',
	persentageLable : '.budget__expenses--percentage',
	container : '.container',
	expPersentageLable : '.item__percentage',
	dateLabel : '.budget__title--month'
	};
	var formateNumber = function(num,type){
			var spiltnum , int, dec;
			
			num = Math.abs(num);
			num = num.toFixed(2)
			spiltnum = num.split('.');
			int = spiltnum[0];
			
			
			if(int.length > 3){
				int =int.substr(0 , int.length - 3) + ',' +int.substr(int.length -3 , 3);
			}
			dec = spiltnum[1];
			
			return (type === 'exp'? '-' : '+') +' '+ int + '.' + dec ; 
			
		};
		
	return{
		getInput : function(){
			
			return{
					type : document.querySelector(DOMstrings.inputType).value, //exp or inc
					description : document.querySelector(DOMstrings.inputDescription).value,
					value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
			};
		},
		addListItem : function (obj, type){
			var html, newhtml, element;
			//creat HTML string with perticular test
		if(type ==='inc'){
			 element = DOMstrings.incomeContainer;
			html = ' <div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';}
			else if(type === 'exp'){
				element = DOMstrings.expenceContainer;
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';}
			// replace the placeholdertext with actual data
			newhtml = html.replace('%id%', obj.id );
			newhtml = newhtml.replace('%description%', obj.description);
			newhtml = newhtml.replace('%value%',formateNumber(obj.value , type));
			
			//Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newhtml);
		},
		deleteItem : function(ID){
			var element = document.getElementById(ID);
			element.parentNode.removeChild(element);
		},
		clearField : function(){
			var field , arrayField;
			
			field = document.querySelectorAll(DOMstrings.inputDescription + ','+ DOMstrings.inputValue);
			arrayField = Array.prototype.slice.call(field);
			arrayField.forEach(function(current, index , array){
				current.value = "";
			});
			arrayField[0].focus();	
		},
		
		displayBudget : function(obj){
			var type;
			obj.budget > 0 ? type = 'inc' : type = 'exp';
		document.querySelector(DOMstrings.budgetLabel).textContent = formateNumber(obj.budget , type);	
		document.querySelector(DOMstrings.incomeLable).textContent =  formateNumber(obj.totalInc , 'inc');
		document.querySelector(DOMstrings.expenseLable).textContent =  formateNumber(obj.totalExp, 'exp');
		
			if(obj.percentage > 0){
				document.querySelector(DOMstrings.persentageLable).textContent = obj.percentage + '%';
			}
			else{
				document.querySelector(DOMstrings.persentageLable).textContent = '---';
			}
		},
		displayPersentage : function(percentages){
		
			var fields = document.querySelectorAll(DOMstrings.expPersentageLable);
			
			//fields.forEach(function(cureent, index))
			
			var nodeForEach = function(list , callback){
				for(var i = 0 ; i < list.length ; i++){
					callback(list[i] , i);
				}
			};
			
			nodeForEach(fields,function(current, index){
						if(percentages[index] > 0){
							current.textContent = percentages[index] + '%';
						}
					else{
					current.textContent ='---'
					}
						});
			
		},
		changeType : function(){
		var fields =document.querySelectorAll(DOMstrings.inputType +','+ DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
		
			var nodefield = function(list, callback){
				for(var i = 0 ; i < list.length ; i++){
					callback(list[i]); //  , i
				}
			};
			
			nodefield(fields , function(current){
			current.classList.toggle('red-focus');	
			});
			document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
			//array.foreach(function(current){})
			
		},
		
		displayMonth : function(){
			var now , year , month;
			 now = new Date();
			months = [ 'January' , 'February' , 'March' , ' April' , 'May', 'June' , 'July' , 'August', 'Septemer', 'October', 'November' , 'Decmber'];
			month = now.getMonth();
			year = now.getFullYear();
			document.querySelector(DOMstrings.dateLabel).textContent = months[month - 1] + ' ' + year;
			
		},
		getDOMstrings : function(){
			return DOMstrings;
		}
	};
	
})();


//GLOBEL APP CONTROLER
var controller = (function(budgetCtrl , UIcntrl){
	
	var setupEventListner = function(){
			var DOM = UIcntrl.getDOMstrings();
		
			document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
		
			document.addEventListener('keypress',function(event){
			if(event.keyCode === 13 || event.which === 13){
			ctrlAddItem();
		}	
	});
		
		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
		document.querySelector(DOM.inputType).addEventListener('change', UIcntrl.changeType);
		
	};
	var updateBudget = function(){
		
		//1 calculate budget
		budgetCtrl.calculateBudget();
		
		// 2 return budget
		var budget = budgetCtrl.getBudget();
		
	    //3 dislay ui budget
		UIcntrl.displayBudget(budget);
	};
	
	var updatePercantage = function(){
		
		
	//1 calculate persentage  in bugetcontroller
		budgetCtrl.calculatePercentage();
		
	// 2 get persentage from budgetcontroller
		var persentages= budgetCtrl.getPercentages();
		
	// 3 update UL
		UIcntrl.displayPersentage(persentages)
	}
	var ctrlAddItem = function(){
		
		var input, newItem;
		//1.get input data
		 input = UIcntrl.getInput();
		//validate fields 
		if(input.description !== "" && input.value > 0 && !isNaN(input.value)){
		//2.add the item to the budget controller
		newItem = budgetCtrl.addItem(input.type , input.description , input.value);
		
		//3 add item to ui
		UIcntrl.addListItem(newItem , input.type);
		//4 clear input
		UIcntrl.clearField();
		// 5 cal and update budget
		updateBudget();
		// 6 update persentage
			updatePercantage();
			
		}
		
	};
	
	var ctrlDeleteItem = function(event){
		var itemID , splitID, type , ID;
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
		if(itemID){
			splitID = itemID.split('-');
			type = splitID[0];
			ID  = parseInt(splitID[1]);
			
			//delete item from UI 
			budgetCtrl.deleteItem(type , ID);
			// delte from budget controller 
			UIcntrl.deleteItem(itemID);
			// update budget and display
			updateBudget();
			// update persentage
			updatePercantage();
			
		}
	};
	return{
		init: function(){
			UIcntrl.displayBudget({
				budget : 0,
					totalInc : 0,
					totalExp : 0,
					percentage : 0
			});
			setupEventListner();
			UIcntrl.displayMonth();
		}
	}

})(budgetController , UIController);

controller.init();
