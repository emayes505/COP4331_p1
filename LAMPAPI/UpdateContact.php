<?php
	$inData = getRequestInfo();

	$userId = $inData["userId"];
	$contactId = $inData["contactId"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT FirstName, LastName, Phone, Email FROM Contacts WHERE ID=? AND UserID=?");
		$stmt->bind_param("ii", $contactId, $userId);
		$stmt->execute();
		$result = $stmt->get_result();

		if ($row = $result->fetch_assoc())
		{
			$firstName = isset($inData["firstName"]) ? $inData["firstName"] : $row["FirstName"];
			$lastName = isset($inData["lastName"]) ? $inData["lastName"] : $row["LastName"];
			$phone = isset($inData["phone"]) ? $inData["phone"] : $row["Phone"];
			$email = isset($inData["email"]) ? $inData["email"] : $row["Email"];

			$stmt->close();

			$updateStmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ID=? AND UserID=?");
			$updateStmt->bind_param("ssssii", $firstName, $lastName, $phone, $email, $contactId, $userId);
			$updateStmt->execute();

			returnWithSuccess();

			$updateStmt->close();
		}
		else
		{
			returnWithError("No contact found with that ID for this user");
			$stmt->close();
		}

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
		$retValue = '{"success":false,"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithSuccess()
	{
		$retValue = '{"success":true,"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
