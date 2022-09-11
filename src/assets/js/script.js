let data = require('./table-data.json')

// Global variables
let sortIndex = 0
let sortDir = 'asc'
let showMore = false
let searchFilter
const initLength = 7
const sortingFields = ['country','topYoutuber']
let sortedLength

// Sort variable
const sortMode = {
    key:'earnings',
    direction: -1
}

// Category filter variables
let dataMode = 'Overall'


// Loading functions
$(window).on('load',function() {
    generateTableData()
})

// Generate the table data
function generateTableData() {
    // Clear rows
    $('#tableData tbody tr').remove()

    // Make a copy of data (don't want to alter the original)
	let copyOfData = [...data]
     // sort data
     let sorted = copyOfData
     .filter(e => e.category===dataMode)
     .filter(e => !searchFilter || sortingFields.reduce((acc,f)=>{
        if(acc){
            return acc
        }   
        acc = e[f].toLowerCase().indexOf(searchFilter)>=0 
        return acc
     },false)
     )
     .sort((a,b) => a[sortMode.key]>b[sortMode.key]? sortMode.direction : -1 * sortMode.direction)

     sortedLength = sorted.length
     // Show whole table
    let pageLength = Math.min(initLength,sortedLength);
	if (showMore) {
		pageLength = sortedLength
	}
    //Fill up the table with the data with loved(hated) mode
    for (let i = 0; i <= pageLength-1; i++) {
        let row = sorted[i]
		let dataHtml = `
			<tr>
				<td>${row.country}</td>
                <td>${row.topYoutuber}</td>
				<td class="hidden-sm">${row.category}</td>	
                <td>$${numberWithCommas(row.earnings)}</td>		
			</tr>
		`
		$('#tableData tbody').append(dataHtml)
	}

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

//Sort function

$("#tableData thead th:not([noSort])").on('click',function(ev) {
    const targetElement = ev.target.tagName.toLowerCase()==='th' ? ev.target : ev.target.closest('th')
    const targetTitle = $(targetElement).children('.table-title')
    if (!targetTitle) {
        return
    }
	const targetKey = targetTitle.data('field')
	if (targetKey===sortMode.key) {
		sortMode.direction = -1 * sortMode.direction
	} else {                
		sortMode.key = targetKey
	}
	$(targetTitle).attr('data-direction',sortMode.direction)

    $('#tableData thead th div').removeClass(['sort-desc', 'sort-asc'])

    if(sortMode.direction === -1){
        $(targetTitle).addClass('sort-asc')
    }else{
        $(targetTitle).addClass('sort-desc')
    }
	generateTableData()
});
//Show and hide the whole table function

$("#btnShowHide").on('click',function(ev){
    if (sortedLength<initLength) {
        return
    }
        showMore = !showMore; 
	    $(ev.target).text(showMore?'Hide':'Show More'); 
	generateTableData()
});


//Category switch function

$("#switchButtons button").on('click',function(ev) {
	dataMode = $(ev.target).data('field')
        $("#switchButtons button").removeClass("activeMode");
		$(this).addClass("activeMode");
	generateTableData()
});

// Search function

$('#search').on('keyup', function(){
    searchFilter = $(this).val().toLowerCase();
    generateTableData();
})

//Embed button

$("#embedBtn").on('click',function(){
    $('#embedHolder').fadeIn("slow");
	document.getElementById('embedBox').scrollIntoView({behavior: 'smooth'});
});
$("#crossEmbedBtn").on('click',function(){
    $('#embedHolder').fadeOut("slow");
});
$(document).keyup(function(e) {
    if (e.key === "Escape") { 
       $('#embedHolder').fadeOut("slow");
     }
});
$("#copyBtn").on('click',function(){
    $('#embedCode').select();
	document.execCommand('copy');
});
$(document).click(function(event) {
    if (!$(event.target).closest("#embedBox, #embedBtn").length) {
        $('#embedHolder').fadeOut("slow");
    }
});

// Embed text copy

const textToCopy = document.querySelector('#embedCode').innerText

document.querySelector('#copyBtn').addEventListener('click' , ()=> {
  	navigator.clipboard.writeText(textToCopy)
	$('#coppiedPopup').fadeIn("slow")
	setTimeout(()=>{
		$('#coppiedPopup').fadeOut("slow")
	},3000)
})


//Info button

$("#infoBtn").on('click',function(){
    $('#infoHolder').fadeIn("slow");
	document.getElementById("infoBox").scrollIntoView({behavior: 'smooth'});
});

$("#crossInfoBtn").on('click',function(){
    $('#infoHolder').fadeOut("slow");
});
$(document).keyup(function(e) {
    if (e.key === "Escape") { 
       $('#infoHolder').fadeOut("slow");
     }
});
$(document).click(function(event) {
    if (!$(event.target).closest("#infoBox, #infoBtn").length) {
        $('#infoHolder').fadeOut("slow");
    }
});