<?php
	$inData = getRequestInfo();

	$userId = isset($inData["userId"]) ? $inData["userId"] : "";
	$firstName = isset($inData["firstName"]) ? $inData["firstName"] : "";
	$lastName = isset($inData["lastName"]) ? $inData["lastName"] : "";
	$phone = isset($inData["phone"]) ? $inData["phone"] : "";
	$email = isset($inData["email"]) ? $inData["email"] : "";

	// Validate required fields
	if ($userId == "" || $firstName == "" || $lastName == "" || $phone == "" || $email == "")
	{
		returnWithError("Required field was missing");
		exit();
	}

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError("Database connection failed");
	}
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (UserId,FirstName,LastName,Phone,Email) VALUES(?,?,?,?,?)");
		if (!$stmt)
		{
			returnWithError("Failed to prepare statement");
			$conn->close();
			exit();
		}

		$stmt->bind_param("issss", $userId, $firstName, $lastName, $phone, $email);

		if ($stmt->execute())
		{
			returnWithSuccess();
		}
		else
		{
			returnWithError("Failed to add contact: " . $stmt->error);
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
		$retValue = '{"success":false,"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithSuccess()
	{
		$retValue = '{"success":true,"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
