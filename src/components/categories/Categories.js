import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '../../contexts/UserContext'
import { NotificationContext } from '../../contexts/NotificationContext'
import { NetworkContext } from '../../contexts/NetworkContext'
import { useTranslation } from 'react-i18next'
import TreeView from 'react-accessible-treeview'
import { Form } from 'react-bootstrap'
import { Icon } from '../util/CustomIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faChevronDown, faChevronRight, faCircle, faCircleNotch, faPen, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons'
import '../../style/categories/Categories.css'
import { NotificationType } from '../notification/Notifications'

const useFocus = () => {
    const htmlElRef = useRef(null)
    const setFocus = () => { htmlElRef.current && htmlElRef.current.focus() }

    return [htmlElRef, setFocus]
}

const ListIcon = () =>
    <span className="icon-wrapper">
        <Icon className="circle" icon={faCircle} />
    </span>

const ArrowIcon = ({ isOpen, onClick }) =>
    <span className="icon-wrapper" onClick={onClick}>
        <Icon
            className="arrow"
            icon={isOpen ? faChevronDown : faChevronRight}
        />
    </span>

const ActionBtn = ({ className = '', icon, onClick, tooltip }) =>
    <span className="iconBtn-wrapper" onClick={e => { e.stopPropagation(); onClick(e); }}>
        <Icon
            className={`iconBtn ${className}`}
            icon={icon}
            tooltip={tooltip}
        />
    </span>

const Actions = ({ element, isExpanded, savingElements, addNewCategoryToList, editCategory, deleteCategory }) => {
    const { t } = useTranslation();
    const [isLoading, setLoading] = useState(false);

    return isLoading || savingElements?.includes(element?.id)
        ? <FontAwesomeIcon icon={faCircleNotch} className="faSpin" />
        : <div className="btns actions">
            <ActionBtn
                className={element.id < 0 ? 'hide' : ''}
                icon={faPlusCircle}
                onClick={() => addNewCategoryToList(element.id, isExpanded)}
                tooltip={t('customButtons.add.tooltip')}
            />
            <ActionBtn
                className={element.id < 0 ? 'hide' : ''}
                icon={faPen}
                onClick={() => editCategory(element.id, element.name)}
                tooltip={t('customButtons.edit.tooltip')}
            />
            <ActionBtn
                // className={element.id < 0 || element.children?.length > 0 ? 'hide' : ''}
                icon={faTrash}
                onClick={async () => { setLoading(true); await deleteCategory(element); setLoading(false); }}
                tooltip={t('customButtons.delete.tooltip')}
            />
        </div>
}

export default function Categories() {
    const { t } = useTranslation();
    const { department, userLoading } = useContext(UserContext);
    const { pushNotification } = useContext(NotificationContext);
    const { rq } = useContext(NetworkContext);
    const [expandedIds, setExpandedIds] = useState([]);
    const [categories, setCategories] = useState([{ "id": 0, "children": [], "parent": null }]);
    const [categoryEdit, setCategoryEdit] = useState(null);
    const [inputRef, setInputFocus] = useFocus();
    const [isLoading, setLoading] = useState(true);
    const [savingElements, setSavingElements] = useState([]);

    useEffect(() => { if (userLoading) setLoading(true) }, [userLoading]);

    useEffect(() => {
        setLoading(true);

        rq('/categories?numDocs=true', { method: 'GET' })
            .then(res => { if (res.ok) return res.json() })
            .then(cats => {
                setCategories([
                    { id: 0, name: '', children: [-1, ...cats.filter(c2 => !c2.parent).map(c2 => c2.id)], parent: null },
                    ...cats.map(c => { return { ...c, parent: c.parent || 0, children: cats.filter(c2 => c2.parent === c.id).map(c2 => c2.id) } }),
                    { id: -1, name: ' ', children: [], parent: 0, fixed: true }
                ]); setLoading(false);
            });
    }, [rq, department]);

    const toggleExpand = (id, isExpanded) =>
        isExpanded
            ? setExpandedIds(expandedIds.filter(e => e !== id))
            : setExpandedIds([...expandedIds, id]);

    const addNewCategoryToList = (parentId, isExpanded, el) => {
        let tempCategories = categories.filter(c => c.temp);
        if (tempCategories.length && tempCategories.some(tc => tc.parent === parentId)) return;

        if (!isExpanded) toggleExpand(parentId);

        let category = { ...el, id: el?.id || crypto.randomUUID(), name: el?.name || '', temp: !el?.id, children: [], parent: parentId }
        setCategories(cats => [
            ...cats
                .filter(c => !tempCategories.some(tc => tc.id))
                .map(c => c.id !== parentId
                    ? tempCategories.some(tc => tc.parent === c.id)
                        ? { ...c, children: c.children.filter(c2 => tempCategories.some(tc => tc.some(tc.id === c2))) }
                        : c
                    : {
                        ...c,
                        children: [...cats.filter(c2 => c.children.some(c3 => c3 === c2.id)), category]
                            .sort((a, b) => a.fixed ? -1 : b.fixed ? 1 : a.name?.localeCompare(b.name))
                            .map(c2 => c2.id)
                    }
                ),
            category
        ]);

        if (!el?.id) {
            setCategoryEdit(category);

            setTimeout(() => setInputFocus(), 200);
        }
    }

    const editCategory = (id, name) => {
        setCategoryEdit({ id: id, name: name });

        setTimeout(() => setInputFocus(), 100);
    }

    const removeCategoryFromList = (id, parentId) =>
        setCategories(cats => cats
            .filter(c => c.id !== id)
            .map(c => c.id !== parentId ? c : { ...c, children: c.children.filter(c2 => c2 !== id) })
        )

    const updateCategoryName = shouldRemoveFromList => {
        if (categoryEdit.name) {
            let cat = categories.filter(c => c.id === categoryEdit.id);

            if (!!cat.length) {
                let originalName = cat[0].name;
                
                if (categoryEdit.name !== originalName) {
                    let originalOrder = categories.filter(c => c.children.some(c2 => c2 === categoryEdit.id))[0].children.indexOf(categoryEdit.id);
        
                    categoryEdit.temp
                        ? addCategory(categoryEdit.id, categoryEdit.name, categoryEdit.parent)
                        : updateCategory(categoryEdit.id, categoryEdit.name, originalName, originalOrder);
        
                    setCategories(cats =>
                        cats.map(c => c.id === categoryEdit.id
                            ? { ...c, name: categoryEdit.name, temp: false }
                            : c.children.some(c2 => c2 === categoryEdit.id)
                                ? {
                                    ...c,
                                    children: [...cats.filter(c2 => c.children.some(c3 => c3 !== categoryEdit.id && c3 === c2.id)), categoryEdit]
                                        .sort((a, b) => a.fixed ? -1 : b.fixed ? 1 : a.name?.localeCompare(b.name))
                                        .map(c2 => c2.id)
                                }
                                : c
                        ));
                    shouldRemoveFromList = false;
                }
            }
        }

        cancelCategoryEdit(shouldRemoveFromList);
    }

    const cancelCategoryEdit = removeFromList => {
        setCategoryEdit(null);
        if (removeFromList) removeCategoryFromList(categoryEdit.id, categoryEdit.parent);
    }

    const addCategory = (id, name, parent) => {
        if (!name) return;

        setSavingElements(e => [...e, id]);

        rq(`/categories`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, parent: parent > 0 ? parent : null })
        }).then(res => {
            if (!res.ok) {
                pushNotification(NotificationType.ERROR, 'categories.add.fail', { name: name });
                throw Error();
            }

            pushNotification(NotificationType.SUCCESS, 'categories.add.success', { name: name });
            return res.json();
        }).then(cat => {
            setCategories(cats =>
                cats.map(c => c.id === id
                    ? { ...c, id: cat.id }
                    : c.children.some(c2 => c2 === id)
                        ? { ...c, children: c.children.map(c2 => c2 === id ? cat.id : c2) }
                        : c
                )
            );
        }).catch(err => {
            removeCategoryFromList(id, parent);
        }).finally(() => {
            setSavingElements(e => e.filter(e2 => e2 !== id));
        });
    }

    const updateCategory = (id, name, originalName, originalIndex) => {
        if (!name) return;

        setSavingElements(e => [...e, id]);

        rq(`/categories/${id}`, {
            method: 'PATCH',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name })
        }).then(res => {
            if (!res.ok) {
                if (res.status === 412)
                    return res.json();

                pushNotification(NotificationType.ERROR, 'categories.update.fail', { oldName: originalName, newName: name });
                throw Error();
            }

            pushNotification(NotificationType.SUCCESS, 'categories.update.success', { oldName: originalName, newName: name });
        }).then(res => {
            if (res && res.i18nMsgKey)
                pushNotification(NotificationType.ERROR, `categories.update.${res.i18nMsgKey}`, { oldName: originalName, newName: name });
        }).catch(err => {
            setCategories(cats =>
                cats.map(c => c.id === id
                    ? { ...c, name: originalName }
                    : c.children.some(c2 => c2 === id)
                        ? {
                            ...c,
                            children: [
                                ...c.children.filter(c2 => c2 !== id).slice(0, originalIndex),
                                id,
                                ...c.children.filter(c2 => c2 !== id).slice(originalIndex)
                            ]
                        }
                        : c
                ));
        }).finally(() => {
            setSavingElements(e => e.filter(e2 => e2 !== id));
        });
    }

    const deleteCategory = async element => {
        // if (element.temp || categories.some(c => c.parent === element.id)) return;

        await rq(`/categories/${element.id}`, {
            method: 'DELETE'
        }).then(res => {
            if (!res.ok) {
                if (res.status === 412)
                    return res.json();
                else
                    pushNotification(NotificationType.ERROR, 'categories.delete.fail', { name: element.name });
            }

            pushNotification(NotificationType.SUCCESS, 'categories.delete.success', { name: element.name });
            removeCategoryFromList(element.id, element.parent);
        }).then(res => {
            if (res && res.i18nMsgKey)
                pushNotification(NotificationType.ERROR, `categories.delete.${res.i18nMsgKey}`, { name: element.name })
        });
    }

    return (
        <div className="header-n-table-div categories-page">
            <h1>{t('categories.page.title')}</h1>
            {isLoading
                ? <div className="loading-wrapper">
                    <FontAwesomeIcon icon={faCircleNotch} className="faSpin" />
                </div>
                : <TreeView
                    data={categories}
                    expandedIds={expandedIds}
                    nodeRenderer={({
                        element,
                        level,
                        isBranch,
                        isExpanded,
                        isDisabled,
                        getNodeProps,
                        handleExpand,
                    }) => <div {...{
                        ...getNodeProps({
                            onClick: e => {
                                handleExpand(e);
                                if (isBranch)
                                    toggleExpand(element.id, isExpanded)
                                else if (categoryEdit)
                                    cancelCategoryEdit(categoryEdit.temp);
                            }
                        }),
                        role: element.fixed ? 'header' : ''
                    }}>
                            <div className="tree-row">
                                {
                                    !element.fixed
                                        ? isBranch
                                            ? <ArrowIcon isOpen={isExpanded} />
                                            : <ListIcon />
                                        : <ActionBtn
                                            className="icon-wrapper add-category"
                                            icon={faPlusCircle}
                                            onClick={() => addNewCategoryToList(0, true)}
                                            tooltip={t('customButtons.add.tooltip')}
                                        />
                                }
                                {categoryEdit?.id !== element.id
                                    ? <>
                                        <span className="name">{element.name}</span>
                                        <Actions
                                            element={element}
                                            isExpanded={isExpanded}
                                            savingElements={savingElements}
                                            addNewCategoryToList={addNewCategoryToList}
                                            editCategory={editCategory}
                                            deleteCategory={deleteCategory}
                                        />
                                    </>
                                    : <div className="edit-category">
                                        <Form.Control
                                            defaultValue={categoryEdit.name}
                                            onBlur={e => {
                                                if (e.currentTarget?.parentElement?.parentElement?.parentElement === e.relatedTarget) return;
                                                cancelCategoryEdit(categoryEdit.temp);
                                            }}
                                            onChange={e => setCategoryEdit({ ...categoryEdit, name: e.currentTarget.value })}
                                            onClick={e => e.stopPropagation()}
                                            onKeyDown={e => {
                                                e.stopPropagation();
                                                if (e.code === "Enter") updateCategoryName(categoryEdit.temp);
                                                if (e.code === "Escape") cancelCategoryEdit(categoryEdit.temp);
                                            }}
                                            name={`input-${element.id}`}
                                            ref={inputRef}
                                            type="text"
                                            size="sm" />
                                        <div className="btns">
                                            <ActionBtn
                                                // className={!categoryEdit.name ? 'hide' : ''}
                                                icon={faCheckCircle}
                                                onClick={() => updateCategoryName(categoryEdit.temp)}
                                                tooltip={t('customButtons.confirm.tooltip')}
                                            />
                                        </div>
                                    </div>
                                }
                                {!element.fixed && !element.temp && element.id !== categoryEdit?.id &&
                                    <span className="doc-count">{element.numDocs || 0} docs</span>
                                }
                            </div>
                        </div>
                    }
                />}
        </div>
    )
}