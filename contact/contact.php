<?php
	session_start();
	if(!isset($_SESSION['userid'])){
		header("Location: http://localhost:8080/");
	}
?>
<html>

<head>
	<title>contacty</title>
	<script src="../js/code.js"></script>
</head>

<body>
		<p>Welcome <?php echo $_SESSION['firstname']?> you are signed in</p>
	<div id="logoutButton">
			<button onclick="doLogout()">Logout</button>
	</div>

</body>

</html>
