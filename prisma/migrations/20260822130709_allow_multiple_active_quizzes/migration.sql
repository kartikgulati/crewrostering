-- Drop the (name, storeNumber) unique constraint
DROP INDEX "UserSubmission_name_storeNumber_key";

-- Replace with (name, storeNumber, quizId) so the same crew member can submit
-- different quizzes, but cannot submit the same quiz twice.
CREATE UNIQUE INDEX "UserSubmission_name_storeNumber_quizId_key"
  ON "UserSubmission"("name", "storeNumber", "quizId");
