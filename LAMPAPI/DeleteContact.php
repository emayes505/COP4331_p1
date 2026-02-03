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
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=? AND UserID=?");
		$stmt->bind_param("ii", $contactId, $userId);
		$stmt->execute();

		if ($stmt->affected_rows > 0)
		{
			returnWithSuccess();
		}
		else
		{
			returnWithError("No contact found with that ID for this user");
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
