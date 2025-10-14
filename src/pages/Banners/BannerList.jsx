import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from '../../utils/helpers';
import { fetchBanners, setFilters, clearFilters, deleteBanner, toggleBannerActive, fetchBannerStats } from '../../redux/slices/bannerSlice';
import BannerTableRow from '../../components/Banners/BannerTableRow';
import StatsCard from '../../components/Common/StatsCard';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { BANNER_STATUS } from '../../utils/constants';

// Lazy load the modal component
const BannerFormModal = lazy(() => import('../../components/Banners/BannerFormModal'));

const BannerList = () => {
  const dispatch = useDispatch();
  const { banners, loading, pagination, filters, stats } = useSelector((state) => state.banners);

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term) => {
      dispatch(setFilters({ search: term }));
    }, 300),
    [dispatch]
  );

  useEffect(() => {
    // Load banners and stats when component mounts
    dispatch(fetchBanners({
      page: pagination.page,
      limit: pagination.limit,
      search: filters.search,
      status: filters.status
    }));
    dispatch(fetchBannerStats());
  }, [dispatch]);

  useEffect(() => {
    // Load banners when filters change
    dispatch(fetchBanners({
      page: pagination.page,
      limit: pagination.limit,
      search: filters.search,
      status: filters.status
    }));
  }, [dispatch, pagination.page, pagination.limit, filters.search, filters.status]);

  useEffect(() => {
    // Debounce search input
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    const status = e.target.value;
    setStatusFilter(status);
    dispatch(setFilters({ status }));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    dispatch(clearFilters());
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setShowFormModal(true);
  };

  const handleCloseFormModal = useCallback(() => {
    setShowFormModal(false);
    setEditingBanner(null);
  }, []);

  const handleBannerSaved = useCallback(() => {
    // Refresh banners list and stats
    dispatch(fetchBanners({
      page: pagination.page,
      limit: pagination.limit,
      search: filters.search,
      status: filters.status
    }));
    dispatch(fetchBannerStats());
  }, [dispatch, pagination.page, pagination.limit, filters.search, filters.status]);

  const handleDeleteBanner = async (bannerId) => {
    try {
      await dispatch(deleteBanner(bannerId))
      // Refresh banners and stats after deletion
      dispatch(fetchBanners({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        status: filters.status
      }));
      dispatch(fetchBannerStats());
    } catch (error) {
      // Error is handled by Redux
    }
  };

  const handleToggleBanner = async (bannerId) => {
    try {
      await dispatch(toggleBannerActive(bannerId));
      // Refresh banners and stats after toggle
      dispatch(fetchBanners({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        status: filters.status
      }));
      dispatch(fetchBannerStats());
    } catch (error) {
      // Error is handled by Redux
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(fetchBanners({
      page: newPage,
      limit: pagination.limit,
      search: filters.search,
      status: filters.status
    }));
  };

  const handleLimitChange = (newLimit) => {
    dispatch(fetchBanners({
      page: 1,
      limit: newLimit,
      search: filters.search,
      status: filters.status
    }));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header and Stats */}
      <div className="flex-shrink-0 space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your banner advertisements
            </p>
          </div>
          <button
            onClick={() => setShowFormModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Banner
          </button>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            <StatsCard
              title="Total Banners"
              value={stats.totalBanners}
              icon={
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              color="indigo"
            />
            <StatsCard
              title="Active"
              value={stats.activeBanners}
              icon={
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="green"
            />
            <StatsCard
              title="Inactive"
              value={stats.inactiveBanners}
              icon={
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="red"
            />
            <StatsCard
              title="Current Live"
              value={stats.currentBanners}
              icon={
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              color="blue"
            />
            <StatsCard
              title="Expired"
              value={stats.expiredBanners}
              icon={
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="yellow"
            />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search Banners
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search by title, description..."
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All Status</option>
                <option value={BANNER_STATUS.ACTIVE}>Active</option>
                <option value={BANNER_STATUS.INACTIVE}>Inactive</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={handleClearFilters}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Banners Table */}
      <div className="flex-1 bg-white shadow overflow-hidden sm:rounded-md flex flex-col">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Banners List
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {pagination.total} total banners
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CTA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {banners.length > 0 ? (
                    banners.map((banner) => (
                      <BannerTableRow
                        key={banner._id}
                        banner={banner}
                        onEdit={handleEditBanner}
                        onDelete={handleDeleteBanner}
                        onToggle={handleToggleBanner}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="px-6 py-12 text-center text-sm text-gray-500">
                        No banners found. Create your first banner to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">
                        {(pagination.page - 1) * pagination.limit + 1}
                      </span>{' '}
                      to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                      </span>{' '}
                      of{' '}
                      <span className="font-medium">{pagination.total}</span>{' '}
                      results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={!pagination.hasPrevPage}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {/* Page numbers */}
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              pageNum === pagination.page
                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={!pagination.hasNextPage}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Banner Form Modal - Only render when needed */}
      {showFormModal && (
        <Suspense fallback={<LoadingSpinner size="lg" />}>
          <BannerFormModal
            isOpen={showFormModal}
            onClose={handleCloseFormModal}
            banner={editingBanner}
            onSave={handleBannerSaved}
          />
        </Suspense>
      )}
    </div>
  );
};

export default BannerList;
