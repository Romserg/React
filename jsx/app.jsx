const React = require('react'),
    ReactDOM = require('react-dom'),
    Switch = require('react-router-dom').Switch,
    withRouter = require('react-router-dom').withRouter,
    BrowserRouter = require('react-router-dom').BrowserRouter,
    Route = require('react-router-dom').Route;  


    //Проверка состояния залогинен или нет, для ограничения доступа к странице users после sign out.
class LoginController {
    login() {
        localStorage.login = 'OK'
    }
    logout() {
        localStorage.login = ''
    }
    isLoggedIn() {
        return localStorage.login === 'OK'
    }
}


let loginController = new LoginController();


class LoginForm extends React.Component {
    redirectToUsers() {
        loginController.login()
        this.props.history.push('/users')
        return false
    }

    render() {
        return (
            <input type="button" value="Login" onClick={() => this.redirectToUsers()} />
        )
    }
}
//наполнение массива данными о пользователе.
class UserList extends React.Component {
    constructor(props) {
        super();
        this.state = {
            users: []
        }
        if (!loginController.isLoggedIn()) { //если не залогинен, выкидывает на страницу для логина
            setTimeout(function () {
                props.history.push('/login')
            }, 0)
            return
        }

        this.getUsers();
    }

    getUsers() {
        let self = this;
        fetch('https://jsonplaceholder.typicode.com/users').then(function (res) {
            return res.json();
        }).then((json) => {
            self.setState({ 'users': json });
        })
    }
    //выводим нужные нам свойства юзеров
    formatUsers() {
        return this.state.users.map((usr, i) => {
            return <div key={i}>
                <span>User Name: {usr.name}</span> <br />
                <span>@: {usr.email}</span> <br />
                <span>Phone: {usr.phone}</span><br /><br /></div>
        })
    }
    signOut() {
        loginController.logout()
        this.props.history.push('/login')
    }
    render() {
        let usersDOM = this.formatUsers();
        return (
            <div>
                <div><button onClick={this.signOut.bind(this)}>Sign out</button></div>
                Users:
                <ul>
                    {usersDOM}
                </ul>
            </div>
        )
    }
}
//блок навигации для react-router
const Nav = () => (
    <div id="main">
        <Switch>
            <Route exact path='/login' component={LoginForm} />
            <Route exact path='/users' component={UserList} />
            <Route path='/' component={LoginForm} />
        </Switch>
    </div>
)


ReactDOM.render(
    <BrowserRouter>
        <Nav />
    </BrowserRouter>,
    document.getElementById('container')
);