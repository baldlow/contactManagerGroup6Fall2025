<?php
session_start();
header("Content-Type: application/json");

require __DIR__ . '/../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();
// replace each with corresponding to server
$servername = $_ENV['DB_HOST'];
$sqlUser = $_ENV['DB_USER'];
$sqlPass = $_ENV['DB_PASS'];

$conn = new mysqli($servername, $sqlUser,$sqlPass,$_ENV['DB_NAME']);

if(!$conn){
	echo "connection Failed";
	die("Connection Failed : " .mysqli_connect_error());
}

/* this api is expecting the json to be of format */
/* {
 *	"login":"userLogin",
 *	"password:"userPassword"
 * }
 * */
try{
// set up prepared statement
	/* prepare statement */
	$stmt = $conn->prepare("SELECT password FROM Users WHERE login=?");

	/* bind param */
	$stmt->bind_param("s", $login);

	$userInput = readIncomingJson();
	$login = $userInput["login"];

	$stmt->execute();

	$result = $stmt->get_result();

	$row = $result->fetch_assoc();

	if(!$row){
		$res = [ 'status' => 'failure' ];
		sendOutgoingJson($res);
	}
	if($row["password"] === $userInput["password"]){
		$res = ['status' => 'success'];
		$stmt2 = $conn->prepare("SELECT id,firstname,lastname FROM Users WHERE login=?");
		$stmt2->bind_param("s",$login2);
		$login2= $userInput["login"];
		$stmt2->execute();
		$userInfoResult = $stmt2->get_result();
		$userRow = $userInfoResult->fetch_assoc();
		$_SESSION["userid"] = $userRow["id"];
		$_SESSION["firstname"] = $userRow["firstname"];
		$_SESSION["lastname"] = $userRow["lastname"];
		sendOutgoingJson($res);
		exit;
	}else{
		$res = [ 'status' => 'failure' ];
		sendOutgoingJson($res);
	}


}catch(Exeception $e){
		$res = [ 'status' => 'failure' ];
		sendOutgoingJson($res);
}
function readIncomingJson(){
	$userAssocArray = json_decode(file_get_contents("php://input"),true);
	return $userAssocArray;
}
function sendOutgoingJson($result){
	$data = json_encode($result);
	echo $data;
}
?>
