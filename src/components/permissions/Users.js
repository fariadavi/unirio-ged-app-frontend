import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UserContext } from '../../contexts/UserContext'
import rq from '../../services/api'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import '../../style/search/Search.css'

const UsersTable = () => {
    const { t } = useTranslation();
    const { department } = useContext(UserContext);
    const [ users, setUsers ] = useState([]);

    useEffect(() => {
        if (department != null) {
            rq(`/users/department/${department}`, { method: 'GET' })
            .then(res => { if (res.ok) return res.json() })
            .then(u => setUsers(u?.length ? u : [{ id: 0, fullName: t('document.form.category.zeroOptions') }]));
        }
    }, [department, t])

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th width="5%"><div className="center">{t('table.actions')}</div></th>
                    <th width="25%"><div className="center">Usuário</div></th>
                    <th width="10%"><div className="center">Pesquisar documentos</div></th>
                    <th width="10%"><div className="center">Inserir documentos</div></th>
                    <th width="10%"><div className="center">Editar documentos enviados por outros usuários</div></th>
                    <th width="10%"><div className="center">Excluir documentos enviados por outros usuários</div></th>
                    <th width="10%"><div className="center">Convidar novos usuários</div></th>
                    <th width="10%"><div className="center">Gerenciar permissões de quaisquer usuários</div></th>
                    <th width="10%"><div className="center">Gerenciar categorias</div></th>
                </tr>
            </thead>
            <tbody>
                {users.map((item, index) => (
                    <tr key={item.id}>
                        <td className="actions center"><div>
                                    <Link to={`/documents/${item.id}`}>
                                        <FontAwesomeIcon className="icon" icon={faEdit} />
                                    </Link>
                                    
                                    <span onClick={() => console.log(item.id)}>
                                        <FontAwesomeIcon className="icon" icon={faTrash} />
                                    </span>
                            </div></td>
                        <td><div>{item.fullName}</div></td>
                        <td><div>{item.fullName}</div></td>
                        <td><div>{item.fullName}</div></td>
                        <td><div>{item.fullName}</div></td>
                        <td><div>{item.fullName}</div></td>
                        <td><div>{item.fullName}</div></td>
                        <td><div>{item.fullName}</div></td>
                        <td><div>{item.fullName}</div></td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}

export default function Users() {
    let match = useRouteMatch();

    return (
        <Switch>
            {/* <Route path={`${match.path}/:docId`} component={DocumentForm} /> */}
            <Route path={match.path} component={UsersTable} />
        </Switch>
    )
}
