import React, {Component} from 'react';
import './Form.scss';
import Spinner from '../../components/Spinner/Spinner';
import Table from "../Table/Table";
import { CountryDropdown, RegionDropdown} from 'react-country-region-selector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import firebase from 'firebase';

class Form extends Component {
    state = {
        userInfo : {
            name: '',
            surname: '',
            email: '',
            phone: '',
            country: '',
            region: '',
            persons: 1,
        },
        opened: false,
        spinner: false,
        value: null,
        peopleText: null,
        exist: false

    };

    openRef = React.createRef();

    selectCountry (val) {
        const newValue = {...this.state.userInfo};
        newValue.country = val;
        this.setState({ userInfo: newValue });
    }

    selectRegion (val) {
        const newValue = {...this.state.userInfo};
        newValue.region = val;
        this.setState({ userInfo: newValue });
    }
    nameHandler = (e) => {
        const newValue = {...this.state.userInfo};
        newValue.name = e.target.value;
        this.setState({ userInfo: newValue });
    };
    surnameHandler = (e) => {
        const newValue = {...this.state.userInfo};
        newValue.surname = e.target.value;
        this.setState({ userInfo: newValue });
    };
    mailHandler = (e) => {
        const newValue = {...this.state.userInfo};
        newValue.email = e.target.value;
        this.setState({ userInfo: newValue });
    };
    phoneHandler = (e) => {
        const newValue = {...this.state.userInfo};
        newValue.phone = e.target.value;
        this.setState({ userInfo: newValue });
    };

    CountHandler = (e) => {
        if (e.target.checked) {
            this.setState({opened: true})
        } else {
            this.setState({opened: false})
        }
    };

    choosePers = (el, event) => {
        const newValue = {...this.state.userInfo};
        newValue.persons = el;
        this.setState({ userInfo: newValue, opened: false });
    };

    openCount = () => {
        if (this.openRef.current.clientHeight === 0) {
            this.setState({opened: true})
        } else {
            this.setState({opened: false})
        }
    };

    submitHandler = (e) => {
        e.preventDefault();
        const newVal = {...this.state.userInfo};
        for (let key in newVal) {
            if (newVal[key] === '') {
                alert('Fill all inputs');
                return;
            }
        }
        this.setState({spinner: true});
        // this.dataPop(newVal, true)
        firebase.database().ref('User/').once('value', snapshot => {
            let val = snapshot.val();
            let exist = this.state.exist;
            for (let key in val) {
                if (newVal.email !== val[key].email) {
                    exist = true;
                } else {
                    exist = false;
                }
            }
            this.setState({exist: exist});

        }).then(() => {
           this.dataPop(newVal, this.state.exist);
        });

    };

    dataPop = (newVal, exist) => {
        if (exist) {
            firebase.database().ref('User/').push({
                name: newVal.name,
                surname: newVal.surname,
                email: newVal.email,
                phone: newVal.phone,
                country: newVal.country,
                region: newVal.region,
                count: newVal.persons
            })
                .then(response => {
                    this.setState({spinner: false});
                    this.setState({spinner: false, opened: false, userInfo: {
                            name: '',
                            surname: '',
                            email: '',
                            phone: '',
                            persons: 1
                        }})
                })
        } else {
            alert('Email already exist');
            this.setState({spinner: false, opened: false, userInfo: {
                    name: '',
                    surname: '',
                    email: '',
                    phone: '',
                    persons: 1
                }})
        }
    };

    render() {
        let opened = '';
        let rotate = '';
        if (this.state.opened) {
            opened = 'Opened';
            rotate = 'rotate';
        } else {
            opened = '';
            rotate = '';
        }
        let content = null;
        if (this.state.spinner) {
            content = <Spinner/>
        } else {
            content = <Table/>
        }
        const { country, region } = this.state.userInfo;
        const arr = [2,3,4,5,6];

        let count = this.state.userInfo.persons;
        let text = this.state.peopleText;
        if (count === 1) {
            text = 'More than 1 people';
        } else {
            text = `${count} People`;
            arr.unshift(1);
            let index = arr.indexOf(count);
            if (index >= 0) {
                arr.splice( index, 1 );
            }
        }
        let usr = {...this.state.userInfo};

        return (
            <div className='Head'>
                <form onSubmit={this.submitHandler}>
                    <div className='pic'>
                    </div>
                    <input type='text' placeholder='Name' onChange={this.nameHandler}  value={usr.name}/>
                    <input type='text' placeholder='Surname' onChange={this.surnameHandler} value={usr.surname}/>
                    <input type='email' placeholder='Email' onChange={this.mailHandler} value={usr.email}/>
                    <input type='text' placeholder='Phone Number' onChange={this.phoneHandler} value={usr.phone}/>
                    <CountryDropdown
                        value={country}
                        onChange={this.selectCountry.bind(this)} />
                    <RegionDropdown
                        disableWhenEmpty={true}
                        country={country}
                        value={region}
                        onChange={this.selectRegion.bind(this)} />
                    <label onClick={this.openCount}>{text}
                        <div className={`close ${rotate}`}>
                            {/*<input type='checkbox' onChange={this.CountHandler} className='check'/>*/}
                            <FontAwesomeIcon icon={faChevronUp} />
                        </div>
                    </label>
                    <div className={`Count  ${opened}`} ref={this.openRef}>
                        {arr.map(el => {
                            return <div onClick={this.choosePers.bind(null, el)} key={el}>{el}</div>
                        })}
                    </div>
                    <button>Submit</button>
                </form>
                {content}
            </div>

        );
    }
}

export default Form;