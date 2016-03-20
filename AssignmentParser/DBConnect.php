<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache"); 

if (isSet($_GET['pagesize'])){
	$_SESSION['pagesize'] = $_GET['pagesize'];
} else {
	$_SESSION['pagesize'] = 100;
}
if (isSet($_GET['page'])){
	$_SESSION['page'] = $_GET['page'];
} else {
	$_SESSION['page'] = 0;
}
$indexNow = ((int)$_SESSION['page']) * ((int)$_SESSION['pagesize']);
$db = new SQLite3('networkAssignment.sqlite');
$sql =<<<EOF
select assignment.name as assignmentname,question.id, question.answerid, question.name, question.needReview, Group_Concat(answer.id || "." || answer.name, '|' ) as answers from question
join answer on answer.question_id = question.id
join assignment on assignment.id = question.assignment_id
group by question.id, question.answerid, question.name, question.needReview
-- limit {$indexNow}, {$_SESSION['pagesize']}
EOF;
if (isSet($_GET['assignmentNO'])) {
    $_SESSION['assignmentNO'] = $_GET['assignmentNO'];
    $sql =<<<EOF
select assignment.name as assignmentname,question.id, question.answerid, question.name, question.needReview, Group_Concat(answer.id || "." || answer.name, '|' ) as answers from question
join answer on answer.question_id = question.id
join assignment on assignment.id = question.assignment_id
where assignment.name = {$_SESSION['assignmentNO']}
group by question.id, question.answerid, question.name, question.needReview
-- limit {$indexNow}, {$_SESSION['pagesize']}
EOF;
}
# echo $sql;
$results = $db->query($sql);
$resultJSON = array();
// echo json_encode($results);
while ($row = $results->fetchArray()) {
	$answers = array();
	if(isSet($row['answers']) && $row['answers']){
		$pieces = explode("|", $row['answers']);
		foreach ($pieces as $key => $value) {
			$specificAnswer = array(
				"id" => substr($value, 0, strpos($value, '.')),
				"name" => substr($value,strpos($value, '.') + 1)
				);
			$answers[] = $specificAnswer;
		}
	}
	$array = array(
		"assignmentname" => $row['assignmentname'],
	    "id" => $row['id'],
	    "name"    => $row['name'],
	    "answerid" => $row['answerid'],
	    "needReview" => $row['needReview'],
	    "answers" => $answers
	);
	$resultJSON[] = $array;
}
echo json_encode($resultJSON);