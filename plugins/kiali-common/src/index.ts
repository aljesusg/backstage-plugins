/**
 * Common functionalities for the kiali plugin.
 *
 * @packageDocumentation
 */

export interface Namespace {
  name: string;
  labels?: { [key: string]: string };
}