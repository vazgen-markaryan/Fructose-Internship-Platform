import React, {useState} from "react";
import {Document, Page, pdfjs} from "react-pdf";
import Icon from "@mdi/react";
import {mdiChevronLeft, mdiChevronRight, mdiFileAlertOutline, mdiFullscreen, mdiFullscreenExit} from "@mdi/js";
import {useTranslation} from "react-i18next";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const PdfPreview = ({file, height = 500}) => {

    const {t} = useTranslation();
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [isFullScreen, setIsFullScreen] = useState(false);

    function onDocumentLoadSuccess({numPages}) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function onDocumentLoadError() {
        setNumPages(null);
        setPageNumber(1);
    }

    function changePage(offset) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    function toggleFullScreen() {
        setIsFullScreen(prevState => !prevState);
    }

    return (
        <div className={`pdf-file-preview-zone ${isFullScreen ? 'fullscreen' : ''}`} style={{
            height: isFullScreen ? '80vh' : height + 'px',
            width: 'auto',
            overflow: 'hidden',
            overflowX: 'hidden'
        }}>
            <button onClick={toggleFullScreen} className="fullscreen-toggle"
                    style={{position: 'absolute', top: '10px', right: '10px', zIndex: 10}}>
                <Icon path={isFullScreen ? mdiFullscreenExit : mdiFullscreen} size={1}/>
            </button>

            <div style={{
                height: isFullScreen ? 'calc(100% - 40px)' : '100%',
                overflowY: isFullScreen ? 'auto' : 'hidden',
                overflowX: 'hidden'
            }}>
                {file && (
                    <Document
                        file={file}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={<div className="loader-container">
                            <div className="loader"></div>
                        </div>}
                        error={<div className="loader-container text-dark">
                            <div><Icon path={mdiFileAlertOutline} size={1.5}/><p>{t("pdf_view_page.error")}</p></div>
                        </div>}
                    >
                        {numPages && pageNumber <= numPages && (
                            <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false}
                                  height={isFullScreen ? undefined : height}/>
                        )}
                    </Document>
                )}
            </div>

            <div className="pdf-file-preview-navigation">
                <button type="button" className="btn-icon" disabled={pageNumber <= 1} onClick={previousPage}>
                    <Icon path={mdiChevronLeft} size={1}/>
                </button>
                <p>
                    {pageNumber || (numPages ? 1 : '--')} de {numPages || '--'}
                </p>
                <button type="button" className="btn-icon" disabled={pageNumber >= numPages} onClick={nextPage}>
                    <Icon path={mdiChevronRight} size={1}/>
                </button>
            </div>
        </div>
    );
}

export default PdfPreview;