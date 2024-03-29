import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../contexts/UserContext'
import { NotificationContext } from '../../contexts/NotificationContext'
import { useTranslation } from 'react-i18next'
import { Button, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { CategoryFilter, MinMaxDateFilter, StatusFilter, TextInputFilter, UserDocumentsFilter } from './SearchBarFilters'
import { NotificationType } from '../notification/Notifications'
import LoadButton from '../util/LoadButton'
import '../../style/search/SearchBar.css'

export default function SearchBar({ isSearching, onSearch }) {
    const { t } = useTranslation();
    const { department } = useContext(UserContext);
    const { pushNotification } = useContext(NotificationContext);
    const [expandedOptions, setExpandedOptions] = useState(false);
    const [filters, setFilters] = useState({
        text: '',
        minDate: '',
        maxDate: '',
        category: '',
        myDocuments: false,
        status: ''
    });

    const handleFilterChange = (key, value) => {
        if (key === 'category' && value === '-1')
            value = 0;
        else if (key === 'myDocuments')
            value = value === 'false';

        setFilters({ ...filters, [key]: value });
    };

    const validateFilters = filtersObj =>
        filtersObj.text.trim().length > 0 ||
        filtersObj.category ||
        filtersObj.minDate ||
        filtersObj.maxDate ||
        filtersObj.myDocuments ||
        filtersObj.status;

    const handleSubmit = e => {
        e.preventDefault();
        if (validateFilters(filters)) {
            let { text, ...optFilters } = filters;
            let textQuery = text.trim();
            onSearch(textQuery, optFilters);

            setFilters({ ...filters, text: textQuery });
        } else {
            pushNotification(NotificationType.WARNING, 'search.validation.noParameters')
        }
    }

    useEffect(() => setFilters(f => ({ ...f, category: 0 })), [department]);

    return (
        <Form className="search-bar-form" noValidate={true} onSubmit={handleSubmit}>
            <Form.Group className="search-form-group text-input-group">
                <TextInputFilter
                    value={filters.text}
                    onChange={handleFilterChange}
                    onSubmit={handleSubmit}
                />
            </Form.Group>
            <Form.Group className={`search-form-group filters-group ${expandedOptions ? '' : 'hide'}`}>
                <CategoryFilter
                    label={t('searchBar.filters.category')}
                    onChange={handleFilterChange}
                    value={filters.category}
                    disabled={!expandedOptions}
                />

                <MinMaxDateFilter
                    labelFromDate={t('searchBar.filters.date.from')}
                    labelUntilDate={t('searchBar.filters.date.until')}
                    onChange={handleFilterChange}
                    minDateValue={filters.minDate}
                    maxDateValue={filters.maxDate}
                    disabled={!expandedOptions}
                />

                <div className="custom-input-group two-filter-row">
                    <StatusFilter
                        label={t('searchBar.filters.status')}
                        onChange={handleFilterChange}
                        value={filters.status}
                        disabled={!expandedOptions}
                    />
                    <UserDocumentsFilter
                        label={t('searchBar.filters.registeredByMe')}
                        onClick={handleFilterChange}
                        value={filters.myDocuments}
                        disabled={!expandedOptions}
                    />
                </div>
            </Form.Group>
            <Form.Group className="search-form-group search-actions-group">
                <div className="search-filters-toggle-box">
                    <Button
                        className="color-blue"
                        onClick={() => setExpandedOptions(!expandedOptions)}
                        variant="link">
                        {`${t(`searchBar.${expandedOptions ? 'less' : 'more'}FiltersButton`)} (${Object.entries(filters).filter(([key, value]) => key !== 'text' && value).length})`}
                        <FontAwesomeIcon className="append" icon={expandedOptions ? faAngleUp : faAngleDown} />
                    </Button>
                </div>
                <LoadButton
                    className="border-color-blue bg-color-blue search-btn"
                    isLoading={isSearching}
                    type="submit">
                    {t('searchBar.searchButton')}
                </LoadButton>
            </Form.Group>
        </Form>
    )
}