import { describe, expect, it } from "vitest";
import { INTRO_DURATION, introState } from "@/components/site/intro/timeline";

describe("wedding introduction sequence", () => {
  it("walks uphill from 3 to 8 seconds", () => {
    expect(introState(2.99).hiking).toBe(false);
    expect(introState(3).hiking).toBe(true);
    expect(introState(7.99).hiking).toBe(true);
    expect(introState(8).hiking).toBe(false);
  });
  it("reaches the summit from 8 to 14 seconds", () => {
    expect(introState(8).summit).toBe(true);
    expect(introState(14).summit).toBe(false);
  });
  it("reveals the announcement from 14 to 20 seconds", () => {
    expect(introState(14).reveal).toBe(true);
    expect(introState(20).reveal).toBe(false);
  });
  it("transforms smoothly to winter between 20 and 23 seconds", () => {
    expect(introState(20).winter).toBe(0);
    expect(introState(21.5).winter).toBe(.5);
    expect(introState(23).winter).toBe(1);
  });
  it("skis from 23 to 27 seconds", () => {
    expect(introState(22.99).skiing).toBe(false);
    expect(introState(23).skiing).toBe(true);
    expect(introState(26.99).skiing).toBe(true);
    expect(introState(27).skiing).toBe(false);
  });
  it("ends with the epilogue and enters the homepage at 30 seconds", () => {
    expect(INTRO_DURATION).toBe(30);
    expect(introState(27).epilogue).toBe(true);
    expect(introState(29.99).finished).toBe(false);
    expect(introState(30).finished).toBe(true);
  });
});