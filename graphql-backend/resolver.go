package graphql_backend

import (
	"context"
	"database/sql"
	"time"
) // THIS CODE IS A STARTING POINT ONLY. IT WILL NOT BE UPDATED WITH SCHEMA CHANGES.

type Resolver struct {
	db *sql.DB
}

func (r *Resolver) Transaction() TransactionResolver {
	return &transactionResolver{r}
}

func (r *Resolver) User() UserResolver {
	return &userResolver{r}
}

func NewResolver(db *sql.DB) *Resolver {
	return &Resolver{
		db: db,
	}
}

func (r *Resolver) Mutation() MutationResolver {
	return &mutationResolver{r}
}
func (r *Resolver) Query() QueryResolver {
	return &queryResolver{r}
}

type mutationResolver struct{ *Resolver }

func (r *mutationResolver) UpdateUserDetails(ctx context.Context, userID string, input UpdateUserDetailsInput) (*User, error) {

	tx,err := r.db.BeginTx(ctx,nil)
	if err !=  nil {
		return nil,err
	}

	if input.Name != nil {
		_,err := tx.ExecContext(ctx,"update fintec.users set name = $1 where id = $2",*input.Name,userID)
		if err != nil {
			tx.Rollback()
			return nil,err
		}
	}

	if input.Address != nil {
		_,err := tx.ExecContext(ctx,"insert into fintec.address (user_id,street,city,postal_code,country) values ($1,$2,$3,$4,$5) on conflict on constraint address_user_id_key do update set street = $2, city = $3, postal_code = $4, country = $5",
			userID,input.Address.Street,input.Address.City,input.Address.PostalCode,input.Address.Country)
		if err != nil {
			tx.Rollback()
			return nil,err
		}
	}

	err = tx.Commit()
	if err != nil {
		return nil,err
	}

	row := r.db.QueryRowContext(ctx,"select id, balance, name, email from fintec.users where id = $1",userID)
	var user User
	err = row.Scan(&user.ID,&user.Balance,&user.Name,&user.Email)
	if err == sql.ErrNoRows {
		return nil,nil
	}

	if err != nil {
		return nil,err
	}

	return &user,nil
}

func (r *mutationResolver) CreateUser(ctx context.Context, input NewUserInput) (*User, error) {

	row := r.db.QueryRowContext(ctx,`insert into fintec.users (balance, name, email) values ($1,$2,$3) returning id`,input.Balance,input.Name,input.Email)
	var id string
	if err := row.Scan(&id); err != nil {
		return nil,err
	}

	return &User{
		ID:           id,
		Balance:      input.Balance,
		Name:         input.Name,
	},nil
}

func (r *mutationResolver) MakeTransaction(ctx context.Context, input NewTransaction) (*Transaction, error) {
	tx,err := r.db.BeginTx(ctx,nil)
	if err != nil {
		return nil,err
	}

	transactionDate := time.Now()
	var transactionID string
	row := tx.QueryRowContext(ctx,"insert into fintec.transaction (date, amount, sender, recipient) values ($1,$2,$3,$4) returning id",transactionDate,input.Amount,input.Sender,input.Recipient)
	if err = row.Scan(&transactionID) ;err != nil {
		tx.Rollback()
		return nil,err
	}

	_,err = tx.ExecContext(ctx,"update fintec.users set balance = balance + $1 where id = $2",input.Amount,input.Recipient)
	if err != nil {
		tx.Rollback()
		return nil,err
	}

	_,err = tx.ExecContext(ctx,"update fintec.users set balance = balance - $1 where id = $2",input.Amount,input.Sender)
	if err != nil {
		tx.Rollback()
		return nil,err
	}

	err = tx.Commit()
	if err != nil {
		return nil,err
	}

	return &Transaction{
		ID:        transactionID,
		Date:      transactionDate.String(),
		Amount:    input.Amount,
	}, nil
}


type queryResolver struct{ *Resolver }

func (r *queryResolver) Transactions(ctx context.Context, first int, afterID *string) ([]*Transaction, error) {

	var rows *sql.Rows
	var err error

	if afterID != nil {
		row := r.db.QueryRowContext(ctx,"select date from fintec.transaction where id = $1",*afterID)
		var afterDate time.Time
		err := row.Scan(&afterDate)
		if err == sql.ErrNoRows {
			return nil,nil
		}
		if err != nil {
			return nil,err
		}

		rows,err = r.db.QueryContext(ctx,"select id, date, amount from fintec.transaction where date < $2 order by date desc limit $1",first,afterDate)
		if err == sql.ErrNoRows {
			return nil,nil
		}
		if err != nil {
			return nil,err
		}
	} else {
		rows,err = r.db.QueryContext(ctx,"select id, date, amount from fintec.transaction order by date desc limit $1",first)
		if err == sql.ErrNoRows {
			return nil,nil
		}
		if err != nil {
			return nil,err
		}
	}

	defer rows.Close()

	var out []*Transaction
	for rows.Next() {
		var t Transaction
		err = rows.Scan(&t.ID,&t.Date,&t.Amount)
		if err != nil {
			return nil,err
		}
		out = append(out,&t)
	}

	return out,nil
}

func (r *queryResolver) User(ctx context.Context, id string) (*User, error) {
	row := r.db.QueryRowContext(ctx,"select id, balance, name, email from fintec.users where id = $1",id)
	var user User
	err := row.Scan(&user.ID,&user.Balance,&user.Name,&user.Email)
	if err == sql.ErrNoRows {
		return nil,nil
	}

	if err != nil {
		return nil,err
	}

	return &user,nil
}
func (r *queryResolver) Users(ctx context.Context) ([]*User, error) {
	rows,err := r.db.QueryContext(ctx,"select id, balance, name, email from fintec.users")
	if err != nil {
		return nil,err
	}

	defer rows.Close()

	var out []*User
	for rows.Next() {
		var user User
		err = rows.Scan(&user.ID,&user.Balance,&user.Name,&user.Email)
		if err != nil {
			return nil,err
		}

		out = append(out,&user)
	}

	return out,nil
}

type userResolver struct {
	*Resolver
}

func (r *userResolver) Transactions(ctx context.Context, obj *User, first int, afterID *string) ([]*Transaction, error) {

	if obj == nil {
		return nil,nil
	}

	var rows *sql.Rows
	var err error

	if afterID != nil {
		row := r.db.QueryRowContext(ctx,"select date from fintec.transaction where id = $1 and (recipient = $2 or sender = $2)",*afterID,obj.ID)
		var afterDate time.Time
		err := row.Scan(&afterDate)
		if err == sql.ErrNoRows {
			return nil,nil
		}
		if err != nil {
			return nil,err
		}

		rows,err = r.db.QueryContext(ctx,"select id, date, amount from fintec.transaction where date < $2 and (recipient = $3 or sender = $3) order by date desc limit $1",first,afterDate,obj.ID)
		if err == sql.ErrNoRows {
			return nil,nil
		}
		if err != nil {
			return nil,err
		}
	} else {
		rows,err = r.db.QueryContext(ctx,"select id, date, amount from fintec.transaction where (recipient = $2 or sender = $2) order by date desc limit $1",first,obj.ID)
		if err == sql.ErrNoRows {
			return nil,nil
		}
		if err != nil {
			return nil,err
		}
	}

	defer rows.Close()

	var out []*Transaction
	for rows.Next() {
		var t Transaction
		err = rows.Scan(&t.ID,&t.Date,&t.Amount)
		if err != nil {
			return nil,err
		}
		out = append(out,&t)
	}

	return out,nil
}

func (r *userResolver) Address(ctx context.Context, obj *User) (*Address, error) {

	if obj == nil {
		return nil,nil
	}

	var address Address
	row := r.db.QueryRowContext(ctx,"select street, city, postal_code, country from fintec.address where user_id = $1",obj.ID)
	err := row.Scan(&address.Street,&address.City,&address.PostalCode,&address.Country)
	if err == sql.ErrNoRows {
		return nil,nil
	}

	if err != nil {
		return nil,err
	}

	return &address,nil
}

type transactionResolver struct {
	*Resolver
}

func (r *transactionResolver) Sender(ctx context.Context, obj *Transaction) (*User, error) {
	if obj == nil {
		return nil,nil
	}
	row := r.db.QueryRowContext(ctx,"select u.id, balance, name, email from fintec.transaction t inner join fintec.users u on t.sender = u.id where t.id = $1",obj.ID)
	var user User
	err := row.Scan(&user.ID,&user.Balance,&user.Name,&user.Email)
	return &user,err
}

func (r *transactionResolver) Recipient(ctx context.Context, obj *Transaction) (*User, error) {
	if obj == nil {
		return nil,nil
	}
	row := r.db.QueryRowContext(ctx,"select u.id, balance, name, email from fintec.transaction t inner join fintec.users u on t.recipient = u.id where t.id = $1",obj.ID)
	var user User
	err := row.Scan(&user.ID,&user.Balance,&user.Name,&user.Email)
	return &user,err
}
