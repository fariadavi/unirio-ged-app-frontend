import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import rq from '../../services/api'
import DatePicker from '../Utils/DatePicker'
import { Button, Form, FormControl, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp, faCircleNotch, faSearch } from '@fortawesome/free-solid-svg-icons'

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
            window.alert('fill at least one input')
        }
    }

    const onKeyPress = e => {
        if (e.code === 'Enter')
            handleSubmit(e);
    }

    return (
        <Form id ="search-bar-form" noValidate={true} onSubmit={handleSubmit}>
            <Form.Group className="search-form-group text-input-group">
                <InputGroup>
                    <InputGroup.Text>
                        <FontAwesomeIcon icon={faSearch} />
                    </InputGroup.Text>
                    <FormControl
                        id="textInput" 
                        disabled={isSearching}
                        onChange={e => setFilters({ ...filters, text: e.target.value })}
                        onKeyPress={!isSearching ? onKeyPress : null}
                        value={filters.text}
                        type="text" 
                    />
                </InputGroup>
            </Form.Group>
            <Form.Group className={`search-form-group filters-group ${expandedOptions ? '' : 'hide'}`}>
                <div className="custom-input-group category-filter">
                    <Form.Label>{t('searchBar.filters.category')}</Form.Label>
                    <Form.Select 
                        name="category" 
                        onChange={handleFilterChange}
                        value={filters.category}>
                        <option style={{ display: 'none' }}>{t('document.form.category.choose')}</option>
                        {categories[0]?.id === 0 ? <></> : <option value="-1">-- {t('none')} --</option>}
                            {categories.map(item => (
                            <option key={item.id} value={item.id}>{item.fullName}</option>
                        ))}
                    </Form.Select>
                </div>
                <div className="custom-input-group date-filter">
                    <Form.Label>{t('searchBar.filters.date.from')}</Form.Label>
                    <DatePicker name="minDate" required
                        onChange={handleFilterChange}
                        onClear={() => setFilters({ ...filters, minDate: '' })}
                        max={filters.maxDate}
                        value={filters.minDate}
                    />
                    <Form.Label>{t('searchBar.filters.date.until')}</Form.Label>
                    <DatePicker name="maxDate" required
                        onChange={handleFilterChange}
                        onClear={() => setFilters({ ...filters, maxDate: '' })}
                        min={filters.minDate}
                        value={filters.maxDate}
                    />
                </div>
                <div className="custom-input-group user-filter">
                    <Form.Check type="checkbox" name="myDocuments" custom
                        id="filterMyDocuments"
                        onClick={handleFilterChange}
                        label={t('searchBar.filters.registeredByMe')}
                        value={filters.myDocuments}
                    />
                </div>
            </Form.Group>
            <Form.Group className="search-form-group search-actions-group">
                <div class="search-filters-toggle-box">
                    <Button
                        onClick={() => setExpandedOptions(!expandedOptions)}
                        variant="link">
                        {t(`searchBar.${expandedOptions ? 'less' : 'more'}FiltersButton`)}
                        <FontAwesomeIcon className="append" icon={expandedOptions ? faAngleUp : faAngleDown} />
                    </Button>
                </div>
                <Button
                    className="search-btn"
                    disabled={isSearching}
                    variant="primary"
                    type="submit">
                    {!isSearching
                        ? t('searchBar.searchButton')
                        : <FontAwesomeIcon icon={faCircleNotch} className="faSpin" />}
                </Button>
            </Form.Group>
        </Form>
    )
}
