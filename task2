Self check
Example: A initialize a project with first commit
My role is about new feature git switch -c feature-payment

git merge main 
Give change from main to new branch (payment) but remain the same history for 2 branches
After merge, we have new commit 
Merge good for working in group, because we have all commit history
Rebase good for working alone, because now we have clear commit history 

About the conflict:
<<<<<<< HEAD : my branch
>>>>>>> main: branch main
We have to choose to have the final version

git reset --hard 

1. HEAD → represent current commit
2. Staging area → space have the change 
3. Working directory → coding space 


SQL:
For example: the product never ordered use LEFT JOIN to receive all rows of product. After that, just keep the product (NULL) in the order_items 
→ Not use INNER JOIN because INNER JOIN just help us to get the product already have order
WHERE: filter before GROUP BY
HAVING: filter after GROUP BY
If 2 request update 1 row at the same time —> race condition & lost update. 
Parameterized query prevent SQL Injection


const sql = `
  SELECT *
  FROM users
  WHERE email = '${email}'
`;


' OR '1'='1


=> const result = await pool.query(
  `
    SELECT id, email
    FROM users
    WHERE email = $1
  `,
  [email]
);
