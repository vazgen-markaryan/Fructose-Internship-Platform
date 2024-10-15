import React, {useContext, useState} from "react";
import {Page, Document} from "react-pdf";
import { pdfjs } from 'react-pdf';
import Icon from "@mdi/react";
import {mdiChevronLeft, mdiChevronRight, mdiFileAlertOutline} from "@mdi/js";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const PdfPreview = ({file, height = 500}) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
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

    return(
        <>
            <div className="pdf-file-preview-zone" style={{"height": height + "px"}}>
                <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={<div className="loader-container"><div className="loader"></div></div>}
                    error={<div className="loader-container text-dark"><div><Icon path={mdiFileAlertOutline} size={1.5} /><p>Une erreur est survenue</p></div></div>}
                >
                    <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} height={height}/>
                </Document>
                <div className="pdf-file-preview-navigation">
                    <button
                        type="button"
                        className="btn-icon"
                        disabled={pageNumber <= 1}
                        onClick={previousPage}
                    >
                        <Icon path={mdiChevronLeft} size={1} />
                    </button>
                    <p>
                        {pageNumber || (numPages ? 1 : '--')} de {numPages || '--'}
                    </p>
                    <button
                        type="button"
                        className="btn-icon"
                        disabled={pageNumber >= numPages}
                        onClick={nextPage}
                    >
                        <Icon path={mdiChevronRight} size={1} />
                    </button>
                </div>
            </div>
        </>
    )
}
export default PdfPreview