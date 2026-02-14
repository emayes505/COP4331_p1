<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $login = $inData["login"];
    $password = $inData["password"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{   
        if (checkDuplicate($login, $conn)) {
            returnWithError("Login already exists");
            $conn->close();
            exit();
        }

        $stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Login, Password) VALUES(?,?,?,?)");
        $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
        $stmt->execute();

        returnWithInfo( $firstName, $lastName, $login);

        $stmt->close();
        $conn->close();
	}

    function checkDuplicate($login, $conn)
    {
        $stmt = $conn->prepare("SELECT Login FROM Users WHERE Login=?");
        $stmt->bind_param("s", $login);
        $stmt->execute();
        $result = $stmt->get_result();

        $stmt->close();

        if ($result->num_rows > 0) {
            return true; 
        } else {
            return false; 
        }

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
    	
    function returnWithInfo( $firstName, $lastName, $login )
	{
		$retValue = '{"success":true,"firstName":"' . $firstName . '","lastName":"' . $lastName . '","login":"' . $login . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
