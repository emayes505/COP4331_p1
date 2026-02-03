<?php
	$inData = getRequestInfo();

	$userId = $inData["userId"];
	$contactId = isset($inData["contactId"]) ? $inData["contactId"] : "";
	$firstName = isset($inData["firstName"]) ? $inData["firstName"] : "";
	$lastName = isset($inData["lastName"]) ? $inData["lastName"] : "";
	$phone = isset($inData["phone"]) ? $inData["phone"] : "";
	$email = isset($inData["email"]) ? $inData["email"] : "";
	$search = isset($inData["search"]) ? $inData["search"] : "";

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		// If contactId is provided
		if ($contactId != "")
		{
			$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE ID=? AND UserID=?");
			$stmt->bind_param("ii", $contactId, $userId);
		}
		// search by fields
		else if ($firstName != "" || $lastName != "" || $phone != "" || $email != "")
		{
			$firstNameTerm = "%" . $firstName . "%";
			$lastNameTerm = "%" . $lastName . "%";
			$phoneTerm = "%" . $phone . "%";
			$emailTerm = "%" . $email . "%";

			$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE UserID=? AND FirstName LIKE ? AND LastName LIKE ? AND Phone LIKE ? AND Email LIKE ?");
			$stmt->bind_param("issss", $userId, $firstNameTerm, $lastNameTerm, $phoneTerm, $emailTerm);
		}
		else if ($search != "")
		{
			$searchTerm = "%" . $search . "%";
			$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE UserID=? AND (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?)");
			$stmt->bind_param("issss", $userId, $searchTerm, $searchTerm, $searchTerm, $searchTerm);
		}
		// No search criteria return all contacts for user
		else
		{
			$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE UserID=?");
			$stmt->bind_param("i", $userId);
		}

		$stmt->execute();
		$result = $stmt->get_result();

		$contacts = array();
		while ($row = $result->fetch_assoc())
		{
			$contacts[] = $row;
		}

		if (count($contacts) > 0)
		{
			returnWithContacts($contacts);
		}
		else
		{
			returnWithError("No contacts found");
		}

		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err )
	{
		$retValue = '{"results":[],"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithContacts( $contacts )
	{
		$contactList = "";
		for ($i = 0; $i < count($contacts); $i++)
		{
			if ($i > 0)
			{
				$contactList .= ",";
			}
			$contactList .= '{"id":' . $contacts[$i]['ID'] . ',"firstName":"' . $contacts[$i]['FirstName'] . '","lastName":"' . $contacts[$i]['LastName'] . '","phone":"' . $contacts[$i]['Phone'] . '","email":"' . $contacts[$i]['Email'] . '"}';
		}
		$retValue = '{"results":[' . $contactList . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
