import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import rq from '../../services/api'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp, faCircleNotch, faSearch } from '@fortawesome/free-solid-svg-icons'
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons'

export default function SearchBar({ isSearching, onSearch }) {
    const { t } = useTranslation();
    const [filters, setFilters] = useState({
        text: '',
        minDate: undefined,
        maxDate: undefined,
        category: '',
        myDocuments: false
    });
    const [categories, setCategories] = useState([]);
    const [expandedOptions, setExpandedOptions] = useState(false);

    useEffect(() => {
        rq('/categories', { method: 'GET' })
            .then(res => { if (res.ok) return res.json() })
            .then(cats => setCategories(cats?.length ? cats : [{ id: 0, fullName: t('document.form.category.zeroOptions') }]));
    }, [t])

    const handleFilterChange = e => {
        let name = e.target.name
        let value = e.target.value

        if (name === 'category' && e.target.value === '-1') {
            value = 0
        } else if (name === 'myDocuments') {
            value = e.target.value === 'false'
        }

        setFilters({ ...filters, [name]: value })
    }

    const validateFilters = filtersObj => filtersObj.text.trim().length > 0 || filtersObj.category || filtersObj.minDate || filtersObj.maxDate || filtersObj.myDocuments;

    const handleSubmit = e => {
        e.preventDefault();
        if (validateFilters(filters)) {
            let { text, ...optFilters } = filters;
            onSearch(text.trim(), optFilters);
        } else {
            // TODO message user to fill at least one input
        }
    }

    const onKeyPress = e => {
        if (e.code === 'Enter')
            handleSubmit(e);
    }

    return (
        <Form noValidate={true}
            onSubmit={handleSubmit}
            style={{ width: "100%", maxWidth: "900px" }}>
            <Form.Group>
                <Form.Row>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroupPrepend">
                                <FontAwesomeIcon icon={faSearch} />
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                            disabled={isSearching}
                            onChange={e => setFilters({ ...filters, text: e.target.value })}
                            onKeyPress={!isSearching ? onKeyPress : null}
                            value={filters.text}
                            type="text" />
                    </InputGroup>
                </Form.Row>
            </Form.Group>
            <Form.Group id="btnsGroup">
                <Form.Row className={`searchOptions ${expandedOptions ? '' : 'hide'}`}>
                    <Form.Row>
                        <Form.Label>{t('searchBar.filters.category')}</Form.Label>
                        <Form.Control as="select" name="category"
                            onChange={handleFilterChange}
                            value={filters.category}
                        >
                            <option style={{ display: 'none' }}>{t('document.form.category.choose')}</option>
                            {categories[0]?.id === 0 ? <></> : <option value="-1">-- {t('none')} --</option>}
                            {categories.map(item => (
                                <option key={item.id} value={item.id}>{item.fullName}</option>
                            ))}
                        </Form.Control>
                    </Form.Row>
                    <Form.Row>
                        <div className="dateFilter">
                            <Form.Label>{t('searchBar.filters.date.from')}</Form.Label>
                            <Form.Control type="date" name="minDate" required
                                onChange={handleFilterChange}
                                value={filters.minDate}
                                max={filters.maxDate}
                            />
                            <span className="clear-input" onClick={() => setFilters({ ...filters, minDate: '' })}>
                                <FontAwesomeIcon icon={faTimesCircle} />
                            </span>
                        </div>
                        <div className="dateFilter">
                            <Form.Label>{t('searchBar.filters.date.until')}</Form.Label>
                            <Form.Control type="date" name="maxDate" required
                                onChange={handleFilterChange}
                                value={filters.maxDate}
                                min={filters.minDate}
                            />
                            <span className="clear-input" onClick={() => setFilters({ ...filters, maxDate: '' })}>
                                <FontAwesomeIcon icon={faTimesCircle} />
                            </span>
                        </div>
                    </Form.Row>
                    <Form.Row>
                        <Form.Check type="checkbox" name="myDocuments" custom
                            id="filterMyDocuments"
                            onClick={handleFilterChange}
                            label={t('searchBar.filters.registeredByMe')}
                            value={filters.myDocuments}
                        />
                    </Form.Row>
                </Form.Row>
                <Form.Row>
                    <Button
                        id="searchOptionsBtn"
                        className="searchBtn"
                        onClick={() => setExpandedOptions(!expandedOptions)}
                        variant="link">
                        {t(`searchBar.${expandedOptions ? 'less' : 'more'}FiltersButton`)}
                        <FontAwesomeIcon className="append" icon={expandedOptions ? faAngleUp : faAngleDown} />
                    </Button>
                    <Button
                        className="searchBtn"
                        disabled={isSearching}
                        variant="primary"
                        type="submit">
                        {!isSearching
                            ? t('searchBar.searchButton')
                            : <FontAwesomeIcon icon={faCircleNotch} className="faSpin" />}
                    </Button>
                </Form.Row>
            </Form.Group>
        </Form>
    )
}
