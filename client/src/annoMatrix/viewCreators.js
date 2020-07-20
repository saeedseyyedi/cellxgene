/*
View creators.  These are helper functions which create new views from existing
instances of AnnoMatrix, implementing common UI functions.
*/

import { AnnoMatrixRowSubsetView, AnnoMatrixClipView } from "./views";

export function isubsetMask(annoMatrix, obsMask) {
  /*
		Subset annomatrix to contain the rows which have truish value in the mask.
    Maks length must equal annoMatrix.nObs (row count).
	*/
  return isubset(annoMatrix, _maskToList(obsMask));
}

export function isubset(annoMatrix, obsOffsets) {
  /*
		Subset annomatrix to contain the positions contained in the obsOffsets array

    Example:

      isubset(annoMatrix, [0, 1]) -> annoMatrix with only the first two rows
	*/
  const obsIndex = annoMatrix.rowIndex.isubset(obsOffsets);
  return new AnnoMatrixRowSubsetView(annoMatrix, obsIndex);
}

export function subset(annoMatrix, obsLabels) {
  /*
		subset based on labels
  */
  const obsIndex = annoMatrix.rowIndex.subset(obsLabels);
  return new AnnoMatrixRowSubsetView(annoMatrix, obsIndex);
}

export function clip(annoMatrix, qmin, qmax) {
  /*
		Create a view that clips all continuous data to the [min, max] range.
		The matrix shape does not change, but the continuous values outside the
		specified range will become a NaN.
		*/
  return new AnnoMatrixClipView(annoMatrix, qmin, qmax);
}

/*
Private utility functions below
*/

function _maskToList(mask) {
  /* convert masks to lists - method wastes space, but is fast */
  if (!mask) {
    return null;
  }
  const list = new Int32Array(mask.length);
  let elems = 0;
  for (let i = 0, l = mask.length; i < l; i += 1) {
    if (mask[i]) {
      list[elems] = i;
      elems += 1;
    }
  }
  return new Int32Array(list.buffer, 0, elems);
}
