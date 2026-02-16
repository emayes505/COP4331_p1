const urlBase = 'https://lampproject-g5.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4)
			{
				if (this.status != 200)
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
	
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
	
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}



function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	let cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString() + ";path=/;SameSite=Lax";
	if (window.location.protocol === "https:")
	{
		cookie += ";Secure";
	}
	document.cookie = cookie;
}


function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	if (userId < 0 && !window.location.pathname.includes("index.html")) {
    		window.location.href = "index.html";
	}	
}

function doRegister()
{
	let first = document.getElementById("signupFirstName").value.trim();
	let last = document.getElementById("signupLastName").value.trim();
	let login = document.getElementById("signupLogin").value.trim();
	let password = document.getElementById("signupPassword").value;
	let resultEl = document.getElementById("signupResult");
	let buttonEl = document.getElementById("signupButton");

	if (resultEl)
	{
		resultEl.innerHTML = "";
	}

	if (!first || !last || !login || !password)
	{
		if (resultEl) resultEl.innerHTML = "All fields are required.";
		return;
	}

	if (resultEl) resultEl.innerHTML = "Creating account...";
	if (buttonEl)
	{
		buttonEl.disabled = true;
		buttonEl.innerHTML = "Creating...";
	}

	let tmp = {firstName: first, lastName: last, login: login, password: password};
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/RegisterUser.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4)
			{
				if (this.status != 200)
				{
					if (resultEl) resultEl.innerHTML = "Unable to create account.";
					if (buttonEl)
					{
						buttonEl.disabled = false;
						buttonEl.innerHTML = "Create Account";
					}
					return;
				}

				let jsonObject = JSON.parse(xhr.responseText);
				if (jsonObject.error && jsonObject.error.length > 0)
				{
					if (resultEl) resultEl.innerHTML = jsonObject.error;
					if (buttonEl)
					{
						buttonEl.disabled = false;
						buttonEl.innerHTML = "Create Account";
					}
					return;
				}

				if (resultEl) resultEl.innerHTML = "Account created. You can log in now.";
				window.location.href = "index.html";
			}
		};
		xhr.onerror = function()
		{
			if (resultEl) resultEl.innerHTML = "Network error. Please try again.";
			if (buttonEl)
			{
				buttonEl.disabled = false;
				buttonEl.innerHTML = "Create Account";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		if (resultEl) resultEl.innerHTML = err.message;
		if (buttonEl)
		{
			buttonEl.disabled = false;
			buttonEl.innerHTML = "Create Account";
		}
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	let expired = "firstName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax";
	if (window.location.protocol === "https:")
	{
		expired += "; Secure";
	}
	document.cookie = expired;
	window.location.href = "index.html";
}

function addContact() {
    let first = document.getElementById("firstName").value;
    let last = document.getElementById("lastName").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;

    // Ensure the payload keys match what your PHP expects (e.g., SearchContact.php style)
    let tmp = {
        userId: userId, // Set globally by readCookie()
        firstName: first,
        lastName: last,
        phone: phone,
        email: email
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                // Success logic here (e.g., updating the UI table)
                console.log("Contact Added Successfully");
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.error(err.message);
    }
}

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}

function loadContacts()
{
	let search = "";
	let searchInput = document.getElementById("contactSearch");
	if (searchInput)
	{
		search = searchInput.value.trim();
	}
	let clearBtn = document.getElementById("clearSearchButton");
    	if (clearBtn) {
       	// If there is text in the search box, show the button. Otherwise, hide it.
        	clearBtn.style.display = (search !== "") ? "inline-block" : "none";
    	}
	
	let resultEl = document.getElementById("contactsResult");
	let listEl = document.getElementById("contactsList");
	if (!resultEl || !listEl)
	{
		return;
	}

	resultEl.innerHTML = "";
	listEl.innerHTML = "";
	selectedContactId = null;
	selectedContact = null;

	let tmp = {userId: userId};
	if (search !== "")
	{
		tmp.search = search;
	}
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4)
			{
				if (this.status != 200)
				{
					resultEl.innerHTML = "Unable to load contacts";
					return;
				}

				let jsonObject = JSON.parse(xhr.responseText);
				if (jsonObject.error && jsonObject.error.length > 0)
				{
					resultEl.innerHTML = jsonObject.error;
					return;
				}

				if (!jsonObject.results || jsonObject.results.length === 0)
				{
					resultEl.innerHTML = "No contacts found";
					return;
				}

				let items = "";
				for (let i = 0; i < jsonObject.results.length; i++)
				{
					let c = jsonObject.results[i];
					let name = `${c.firstName} ${c.lastName}`.trim();
					let phone = c.phone ? c.phone : "";
					let email = c.email ? c.email : "";
					items += `<li class="contact-item" data-id="${c.id}" data-first="${c.firstName}" data-last="${c.lastName}" data-phone="${phone}" data-email="${email}">
						<div class="contact-name">${name}</div>
						<div class="contact-meta">${phone} · ${email}</div>
					</li>`;
				}
				listEl.innerHTML = items;
				attachContactSelection();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		resultEl.innerHTML = err.message;
	}
}

function attachContactSelection()
{
	let listEl = document.getElementById("contactsList");
	if (!listEl)
	{
		return;
	}

	listEl.onclick = function(event)
	{
		let target = event.target;
		let item = target.closest(".contact-item");
		if (!item)
		{
			return;
		}

		let items = listEl.querySelectorAll(".contact-item");
		items.forEach((el) => el.classList.remove("selected"));
		item.classList.add("selected");

		selectedContactId = parseInt(item.getAttribute("data-id"));
		selectedContact = {
			id: selectedContactId,
			firstName: item.getAttribute("data-first"),
			lastName: item.getAttribute("data-last"),
			phone: item.getAttribute("data-phone"),
			email: item.getAttribute("data-email")
		};
	};
}

function addContact()
{
	openContactModal("add");
}

function editContact()
{
	if (!selectedContactId || !selectedContact)
	{
		document.getElementById("contactsResult").innerHTML = "Select a contact to edit.";
		return;
	}
	openContactModal("edit");
}

function openContactModal(mode)
{
	contactModalMode = mode;
	let modal = document.getElementById("contactModal");
	let title = document.getElementById("contactModalTitle");
	let err = document.getElementById("modalError");
	let first = document.getElementById("modalFirstName");
	let last = document.getElementById("modalLastName");
	let phone = document.getElementById("modalPhone");
	let email = document.getElementById("modalEmail");
	if (!modal || !title || !first || !last || !phone || !email)
	{
		return;
	}

	if (mode === "edit" && selectedContact)
	{
		title.innerHTML = "Edit Contact";
		first.value = selectedContact.firstName || "";
		last.value = selectedContact.lastName || "";
		phone.value = selectedContact.phone || "";
		email.value = selectedContact.email || "";
	}
	else
	{
		title.innerHTML = "Add Contact";
		first.value = "";
		last.value = "";
		phone.value = "";
		email.value = "";
	}
	if (err) err.innerHTML = "";
	modal.classList.add("is-open");
}

function closeContactModal()
{
	let modal = document.getElementById("contactModal");
	if (modal)
	{
		modal.classList.remove("is-open");
	}
}

function submitContactModal()
{
	let err = document.getElementById("modalError");
	let first = document.getElementById("modalFirstName").value.trim();
	let last = document.getElementById("modalLastName").value.trim();
	let phone = document.getElementById("modalPhone").value.trim();
	let email = document.getElementById("modalEmail").value.trim();

	if (!first || !last || !phone || !email)
	{
		if (err) err.innerHTML = "All fields are required.";
		return;
	}

	let resultEl = document.getElementById("contactsResult");
	let tmp = {userId: userId, firstName: first, lastName: last, phone: phone, email: email};
	let url = urlBase + '/AddContact.' + extension;
	if (contactModalMode === "edit")
	{
		if (!selectedContactId)
		{
			if (err) err.innerHTML = "Select a contact to edit.";
			return;
		}
		tmp.contactId = selectedContactId;
		url = urlBase + '/UpdateContact.' + extension;
	}

	let jsonPayload = JSON.stringify(tmp);
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4)
			{
				if (this.status != 200)
				{
					if (err) err.innerHTML = "Unable to save contact";
					return;
				}
				let jsonObject = JSON.parse(xhr.responseText);
				if (jsonObject.error && jsonObject.error.length > 0)
				{
					if (err) err.innerHTML = jsonObject.error;
					return;
				}
				closeContactModal();
				loadContacts();
				if (resultEl) resultEl.innerHTML = "";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(error)
	{
		if (err) err.innerHTML = error.message;
	}
}

function deleteContact()
{
	if (!selectedContactId || !selectedContact)
	{
		document.getElementById("contactsResult").innerHTML = "Select a contact to delete.";
		return;
	}

	let confirmDelete = confirm("Delete the selected contact?");
	if (!confirmDelete) return;

	let resultEl = document.getElementById("contactsResult");
	let tmp = {userId: userId, contactId: selectedContactId};
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/DeleteContact.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4)
			{
				if (this.status != 200)
				{
					resultEl.innerHTML = "Unable to delete contact";
					return;
				}
				let jsonObject = JSON.parse(xhr.responseText);
				if (jsonObject.error && jsonObject.error.length > 0)
				{
					resultEl.innerHTML = jsonObject.error;
					return;
				}
				loadContacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		resultEl.innerHTML = err.message;
	}
}
function clearSearch() {
    // 1. Clear the text in the correct search input field
    let searchInput = document.getElementById("contactSearch");
    if (searchInput) {
        searchInput.value = "";
    }

    // 2. Hide the "Show All" button
    let clearBtn = document.getElementById("clearSearchButton");
    if (clearBtn) {
        clearBtn.style.display = "none";
    }

    // 3. Clear the result message and reload the full list
    let resultEl = document.getElementById("contactsResult");
    if (resultEl) {
        resultEl.innerHTML = "";
    }
    
    loadContacts();
}
