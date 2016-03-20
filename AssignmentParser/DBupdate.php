<?php
	header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
	header("Cache-Control: post-check=0, pre-check=0", false);
	header("Pragma: no-cache"); 
	if (isSet($_GET['questionid']) && isSet($_GET['answerid']) && isSet($_GET['needReview'])) {
    	$questionid = $_GET['questionid'];
    	$answerid = $_GET['answerid'];
    	$needReview = $_GET['needReview']; 
    	$db = new SQLite3('networkAssignment.sqlite');
$sql =<<<EOF
UPDATE question 
			SET answerid = $answerid, needReview=$needReview 
			WHERE id=$questionid
EOF;
		#echo $sql;
		$query=$db->exec($sql);
		if (!$query) {
		    exit("Error in query: '$error'");
		} else {
		    echo 1;
		}
	} else {
		echo 0;
	}
?>