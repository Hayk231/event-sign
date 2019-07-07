import React, { Component } from 'react';
import './Table.scss';
import FilterableTable from 'react-filterable-table';
import firebase from 'firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMinus } from '@fortawesome/free-solid-svg-icons';

class Table extends Component {
    state = {
        userInfo : []
    };

    componentDidMount() {
        firebase.database().ref('User/').on('value', snapshot => {
            let val = snapshot.val();
            this.popData(val);
        });
    }

    popData = (val) => {
        let allUsers = [];
        let data = val;
        for (let key in data) {
            data[key].id = key;
            allUsers.push(data[key]);
        }
        this.setState({userInfo: allUsers});
    };
    
    deleteHandler = (mail) => {
        firebase.database().ref('User/').on('value', snapshot => {
            let val = snapshot.val();
            for (let key in val) {
                if (val[key].email === mail) {
                    firebase.database().ref('User/' + key).remove().then(() => console.log('deleted'))
                }
            }
        });
    };

    render() {
        const data = [...this.state.userInfo];
        let newData = data.map(el => {
            return {name: el.name, surname: el.surname,
                    email: el.email, phone: el.phone,
                    country: el.country, region: el.region,
                    count: el.count , delete: <span onClick={() => this.deleteHandler(el.email)} className='delete'><FontAwesomeIcon icon={faUserMinus}/></span>
            }
        });
        const fields = [
            { name: 'name', displayName: "Name", sortable: true, inputFilterable: true},
            { name: 'surname', displayName: "Surname", sortable: true, inputFilterable: true},
            { name: 'email', displayName: "Email", sortable: true, inputFilterable: true},
            { name: 'phone', displayName: "Phone", sortable: true, inputFilterable: true},
            { name: 'country', displayName: "Country", sortable: true, inputFilterable: true},
            { name: 'region', displayName: "Region", sortable: true, inputFilterable: true},
            { name: 'count', displayName: "People", sortable: true, inputFilterable: true},
            { name: 'delete', displayName: "Delete", sortable: true },
        ];

        return (
            <div style={{margin: `70px auto`}}>
                <FilterableTable
                    namespace="People"
                    initialSort="name"
                    data={newData}
                    fields={fields}
                    noRecordsMessage="There are no people to display"
                    noFilteredRecordsMessage="No people match your filters!"
                    headerVisible ={true}
                    pagersVisible ={false}
                    topPagerVisible ={false}
                    bottomPagerVisible={false}
                />
            </div>

        );
    }
}

export default Table;